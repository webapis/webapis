module.exports = {
    "env": {
        "browser": true,
        "node":true,
        "es2020": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaVersion": 11,
        "sourceType": "module",
        "ecmaFeatures": {
            jsx: true
        }
    },
    "rules": {
        "no-unused-vars": [
            "error",
            {
              //  "varsIgnorePattern": "^h$"
            }
        ],
    }
};
