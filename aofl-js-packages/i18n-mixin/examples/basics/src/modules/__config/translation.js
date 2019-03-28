const translations = {
  'es-US': () => Promise.resolve({
    default: {
      '<tt-1>': {
        text: 'Saludos!'
      },
      '<tt-2>': {
        text: 'Has iniciado sesión como %%r1::context.user%%'
      },
      '<tt-3>-0': {
        text: 'No tienes mensajes'
      },
      '<tt-3>-1': {
        text: 'Tienes 1 mensaje'
      },
      '<tt-3>-%other%': {
        text: 'Tienes %%r1::context.messageCount%% mensajes'
      }
    }
  })
};

export {
  translations
};
