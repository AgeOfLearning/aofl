context.devEnv = getServerEnvironment(/./, /dontMatch/);
context.stageEnv = getServerEnvironment(/dontMatch/, /./);
context.prodEnv = getServerEnvironment(/dontMatch/, /dontMatch/);
