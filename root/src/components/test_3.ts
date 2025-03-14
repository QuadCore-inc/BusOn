import BackgroundService from 'react-native-background-actions';

const sleep = (time) => new Promise((resolve) => setTimeout(() => resolve(), time));

// Função que executa a tarefa em segundo plano
const veryIntensiveTask = async (taskDataArguments) => {
    console.log("Entrando na tarefa");
    const { delay } = taskDataArguments;
    await new Promise(async (resolve) => {
        for (let i = 0; BackgroundService.isRunning(); i++) {
            console.log(i);
            await sleep(delay);
        }
        resolve();
    });
};

// Opções para o serviço em segundo plano
const options = {
    taskName: 'Example',
    taskTitle: 'ExampleTask title',
    taskDesc: 'ExampleTask description',
    taskIcon: {
        name: 'ic_launcher',
        type: 'mipmap',
    },
    color: '#ff00ff',
    linkingURI: 'yourSchemeHere://chat/jane', // Veja Deep Linking para mais informações
    parameters: {
        delay: 1000,
    },
};

// Função principal para iniciar o serviço em segundo plano
const startBackgroundService = async () => {
    try {
        await BackgroundService.start(veryIntensiveTask, options);
        await BackgroundService.updateNotification({ taskDesc: 'New ExampleTask description' }); // Apenas Android, iOS ignorará esta chamada
        console.log('Background service started successfully!');
    } catch (error) {
        console.error('Error starting background service:', error);
    }
};

// Função para parar o serviço em segundo plano
const stopBackgroundService = async () => {
    try {
        await BackgroundService.stop();
        console.log('Background service stopped successfully!');
    } catch (error) {
        console.error('Error stopping background service:', error);
    }
};

// Exportando as funções para uso em outros arquivos
export { startBackgroundService, stopBackgroundService };