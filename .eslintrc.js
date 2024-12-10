/* eslint-disable prettier/prettier */
module.exports = {
    root: true,
    env: {
      node: true,
    },
    extends: [
      'plugin:vue/vue3-essential',
      'eslint:recommended',
      'plugin:prettier/recommended',
    ],
    parserOptions: {
      ecmaVersion: 2020,
    },
    rules: {
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      // Configuración de Prettier
      'prettier/prettier': [
        'error',
        {
          singleQuote: true, // Usar comillas simples
          parser: "flow",
          endOfLine: 'auto',
        },
      ],
    },
  
  
    
  };
  