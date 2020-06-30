module.exports = {
    "env": {
        "browser": true,
        "node":true,
        "es2020": true
    },
    "extends": ["eslint:recommended","preact"],
    "parserOptions": {
        "ecmaVersion": 11,
        "sourceType": "module",
        "ecmaFeatures": {
            jsx: true
        }
    },
    "rules": {
        "no-unused-vars": 1,
      
    },
    "globals": {
        "Parse": false,
        "ip":false,
        "PREACT_APP_BACK":false,
    }
};
