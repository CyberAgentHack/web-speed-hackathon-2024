module.exports = {
  extends: [require.resolve('@3846masa/configs/eslint'), 'plugin:react/recommended', 'plugin:react-hooks/recommended'],
  rules: {
    'import/order': [
      'error',
      {
        alphabetize: {
          order: 'asc',
        },
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
        'newlines-between': 'always',
        pathGroups: [
          {
            group: 'internal',
            pattern: '@wsh-2024/**',
            position: 'after',
          },
        ],
        pathGroupsExcludedImportTypes: ['builtin', 'object'],
      },
    ],
    'no-undefined': 'off',
    'react/jsx-sort-props': [
      'error',
      {
        reservedFirst: true,
        shorthandFirst: true,
      },
    ],
    'react/jsx-uses-react': 'off',
    'react/prop-types': ['off'],
    'react/react-in-jsx-scope': 'off',
  },
  settings: {
    react: {
      version: '18.2.0',
    },
  },
};
