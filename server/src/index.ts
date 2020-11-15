import { GameServer } from './game-server';

const server = new GameServer();

for (const signal of (['SIGTERM', 'SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGSEGV'] as NodeJS.Signals[])) {
    // SIGKILL, SIGSTOP not working on this node version
    process.on(signal, event => {
        server.saveBeforeExit();
        process.exit();
    });
}
