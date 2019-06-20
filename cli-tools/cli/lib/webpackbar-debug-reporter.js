class DebugReporter {
  constructor() {
    this.lastLine = '';
  }

  start(context) {
    process.stdout.write((`Compiling ${context.state.name}` + '\n'));
  }

  done(context) {
    const {hasError, message, name} = context.state;
    process.stdout.write(([hasError ? 'error' : 'success'] + ' ' + `${name}: ${message}` + '\n'));
  }

  progress(context) {
    if (context.state.details.length) {
      const line = context.state.progress + '% | ' + context.state.message + ' | ' + context.state.details.join(' | ');
      if (line !== this.lastLine) {
        this.lastLine = line;
        process.stdout.write((line + '\n'));
      }
    }
  }
}

module.exports = DebugReporter;
