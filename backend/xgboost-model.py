# -*- coding: utf-8 -*-
"""XGBoost Stress Level Prediction

This script trains an XGBoost model to predict student stress levels (0: acute, 1: periodic, 2: chronic)
using academic and health data, saves the trained model using joblib.
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import joblib

from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score
from xgboost import XGBClassifier
from xgboost import plot_importance

# Load and preprocess data
df = pd.read_csv('StressLevelDataset.csv')
df = df.drop_duplicates()

# Features and target
X = df.drop('stress_level', axis=1)  # All 20 features
y = df['stress_level']  # Target: 0 (acute), 1 (periodic), 2 (chronic)

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42, stratify=y)

# Scale features
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Define hyperparameter grid
param_grid = {
    'learning_rate': [0.01, 0.1, 0.2],
    'max_depth': [3, 5, 7],
    'n_estimators': [100, 200],
    'subsample': [0.8, 1.0],
    'colsample_bytree': [0.8, 1.0]
}

# Initialize and train XGBoost with GridSearchCV
xgb = XGBClassifier(eval_metric='mlogloss', random_state=42)
grid_search = GridSearchCV(estimator=xgb, param_grid=param_grid, cv=5, scoring='accuracy', verbose=2, n_jobs=-1)
grid_search.fit(X_train_scaled, y_train)

# Best model evaluation
best_xgb = grid_search.best_estimator_
y_pred = best_xgb.predict(X_test_scaled)

# Print results
print("Best GridSearchCV Parameters:", grid_search.best_params_)
print("Best GridSearchCV Accuracy Score:", grid_search.best_score_)
print("Test Accuracy:", accuracy_score(y_test, y_pred))
print("Classification Report:\n", classification_report(y_test, y_pred))

# Save the model and scaler
joblib.dump(best_xgb, 'xgb_stress_model.joblib')
joblib.dump(scaler, 'scaler.joblib')
print("Model and scaler saved as 'xgb_stress_model.joblib' and 'scaler.joblib'")

# Plot confusion matrix
plt.figure(figsize=(8, 6))
sns.heatmap(confusion_matrix(y_test, y_pred), annot=True, fmt='d', cmap='Purples')
plt.title('Confusion Matrix - XGBoost')
plt.xlabel('Predicted')
plt.ylabel('Actual')
plt.show()

# Plot feature importance
plt.figure(figsize=(10, 6))
plot_importance(best_xgb, importance_type='weight', max_num_features=10, height=0.5)
plt.title('XGBoost Feature Importance')
plt.show()