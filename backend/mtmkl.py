from sklearn.base import BaseEstimator, ClassifierMixin
from sklearn.svm import SVC
from sklearn.model_selection import StratifiedKFold, cross_val_score
from sklearn.metrics import accuracy_score
import numpy as np

class MTMKLClassifier(BaseEstimator, ClassifierMixin):
    def __init__(self, C=1.0, kernel_list=None, task_kernels_weights=None, max_iter=100, tol=1e-3):
        """
        Multi-Task Multiple Kernel Learning Classifier

        Parameters:
        C (float): Regularization parameter
        kernel_list (list): List of kernel functions ('linear', 'poly', 'rbf', 'sigmoid')
        task_kernels_weights (dict): Initial weights for kernels for each task
        max_iter (int): Maximum number of iterations for optimization
        tol (float): Tolerance for stopping criterion
        """
        self.C = C
        self.kernel_list = kernel_list if kernel_list else ['linear', 'rbf', 'poly', 'sigmoid']
        self.task_kernels_weights = task_kernels_weights if task_kernels_weights else {}
        self.max_iter = max_iter
        self.tol = tol
        self.classifiers_ = {}
        self.task_kernel_importances_ = {}

    def _combine_kernels(self, X, kernel_weights):
        """Combine multiple kernels using weights"""
        combined_kernel = np.zeros((X.shape[0], X.shape[0]))
        for kernel_name, weight in kernel_weights.items():
            if weight > 0:  # Only use kernels with positive weights
                kernel = SVC(kernel=kernel_name, gamma='scale', C=self.C, probability=True)
                # Calculate kernel matrix
                if kernel_name == 'linear':
                    K = np.dot(X, X.T)
                elif kernel_name == 'rbf':
                    # RBF kernel: K(x, y) = exp(-gamma * ||x - y||^2)
                    gamma = 1.0 / X.shape[1]
                    sq_dists = np.sum(X**2, axis=1).reshape(-1, 1) + np.sum(X**2, axis=1) - 2 * np.dot(X, X.T)
                    K = np.exp(-gamma * sq_dists)
                elif kernel_name == 'poly':
                    # Polynomial kernel: K(x, y) = (gamma * x^T * y + coef0)^degree
                    gamma = 1.0 / X.shape[1]
                    K = (gamma * np.dot(X, X.T) + 1.0) ** 3
                elif kernel_name == 'sigmoid':
                    # Sigmoid kernel: K(x, y) = tanh(gamma * x^T * y + coef0)
                    gamma = 1.0 / X.shape[1]
                    K = np.tanh(gamma * np.dot(X, X.T) + 1.0)

                combined_kernel += weight * K

        return combined_kernel

    def _optimize_kernel_weights(self, X, y, task_id, initial_weights=None):
        """Optimize kernel weights for a specific task"""
        if initial_weights is None:
            weights = {k: 1.0 / len(self.kernel_list) for k in self.kernel_list}
        else:
            weights = initial_weights.copy()

        # Normalize weights to sum to 1
        sum_weights = sum(weights.values())
        for k in weights:
            weights[k] /= sum_weights

        best_accuracy = 0
        cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)

        for _ in range(self.max_iter):
            old_weights = weights.copy()

            # Evaluate each kernel's performance separately
            kernel_scores = {}
            for kernel_name in self.kernel_list:
                # Create a single-kernel classifier
                clf = SVC(kernel=kernel_name, C=self.C, probability=True, random_state=42)
                scores = cross_val_score(clf, X, y, cv=cv, scoring='accuracy')
                kernel_scores[kernel_name] = np.mean(scores)

            # Update weights based on performance
            total_score = sum(kernel_scores.values())
            if total_score > 0:
                for k in weights:
                    weights[k] = kernel_scores[k] / total_score

            # Evaluate combined kernel performance
            combined_kernel_clf = SVC(kernel='precomputed', C=self.C, probability=True, random_state=42)
            combined_kernel_matrix = self._combine_kernels(X, weights)

            scores = []
            for train_idx, test_idx in cv.split(X, y):
                X_train_kernel = combined_kernel_matrix[np.ix_(train_idx, train_idx)]
                X_test_kernel = combined_kernel_matrix[np.ix_(test_idx, train_idx)]

                combined_kernel_clf.fit(X_train_kernel, y[train_idx])
                y_pred = combined_kernel_clf.predict(X_test_kernel)
                score = accuracy_score(y[test_idx], y_pred)
                scores.append(score)

            current_accuracy = np.mean(scores)

            if current_accuracy > best_accuracy:
                best_accuracy = current_accuracy
                best_weights = weights.copy()

            # Check convergence
            weight_diff = sum(abs(weights[k] - old_weights[k]) for k in weights)
            if weight_diff < self.tol:
                break

        return best_weights, best_accuracy

    def fit(self, X, y):
        """Fit the MTMKL model to the data"""
        # Store training data for prediction
        self.X_train_ = X.copy()
        # Identify unique tasks (classes)
        self.classes_ = np.unique(y)

        # Initialize kernel weights for each task if not provided
        if not self.task_kernels_weights:
            self.task_kernels_weights = {
                task: {k: 1.0 / len(self.kernel_list) for k in self.kernel_list}
                for task in self.classes_
            }

        # For each task (class), optimize kernel weights and train a binary classifier
        for task in self.classes_:
            print(f"Training for task (class) {task}...")
            # Create binary labels for this task
            y_task = np.where(y == task, 1, 0)

            # Optimize kernel weights for this task
            best_weights, best_acc = self._optimize_kernel_weights(
                X, y_task, task, self.task_kernels_weights.get(task, None))

            self.task_kernels_weights[task] = best_weights
            self.task_kernel_importances_[task] = best_weights

            # Train final classifier with optimized kernel weights
            combined_kernel = self._combine_kernels(X, best_weights)
            clf = SVC(kernel='precomputed', C=self.C, probability=True, random_state=42)
            clf.fit(combined_kernel, y_task)

            self.classifiers_[task] = {
                'classifier': clf,
                'kernel_weights': best_weights,
                'accuracy': best_acc
            }

        return self

    def predict_proba(self, X):
        """Predict class probabilities"""
        if not hasattr(self, 'classifiers_'):
            raise ValueError("Model not fitted yet.")

        # Number of samples
        n_samples = X.shape[0]

        # Initialize probability matrix
        proba = np.zeros((n_samples, len(self.classes_)))

        for i, task in enumerate(self.classes_):
            # Get the classifier and kernel weights for this task
            clf_data = self.classifiers_[task]
            clf = clf_data['classifier']
            kernel_weights = clf_data['kernel_weights']

            # Create combined kernel matrix between X_test and X_train
            if hasattr(self, 'X_train_'):
                # For testing with new data
                combined_kernel = np.zeros((n_samples, self.X_train_.shape[0]))

                for kernel_name, weight in kernel_weights.items():
                    if weight > 0:
                        if kernel_name == 'linear':
                            K = np.dot(X, self.X_train_.T)
                        elif kernel_name == 'rbf':
                            gamma = 1.0 / X.shape[1]
                            sq_dists = np.sum(X**2, axis=1).reshape(-1, 1) + np.sum(self.X_train_**2, axis=1) - 2 * np.dot(X, self.X_train_.T)
                            K = np.exp(-gamma * sq_dists)
                        elif kernel_name == 'poly':
                            gamma = 1.0 / X.shape[1]
                            K = (gamma * np.dot(X, self.X_train_.T) + 1.0) ** 3
                        elif kernel_name == 'sigmoid':
                            gamma = 1.0 / X.shape[1]
                            K = np.tanh(gamma * np.dot(X, self.X_train_.T) + 1.0)

                        combined_kernel += weight * K
            else:
                # For cross-validation during training
                combined_kernel = self._combine_kernels(X, kernel_weights)

            # Get probabilities for this task
            task_proba = clf.predict_proba(combined_kernel)

            # Store probabilities for positive class (class 1)
            proba[:, i] = task_proba[:, 1]

        # Normalize probabilities to sum to 1
        row_sums = proba.sum(axis=1)
        proba = proba / row_sums[:, np.newaxis]

        return proba

    def predict(self, X):
        """Predict class labels"""
        proba = self.predict_proba(X)
        return self.classes_[np.argmax(proba, axis=1)]

    def score(self, X, y):
        """Return accuracy score"""
        return accuracy_score(y, self.predict(X))