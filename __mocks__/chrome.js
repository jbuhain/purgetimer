const chromeMock = {
    alarms: {
        create: jest.fn(),
        onAlarm: { addListener: jest.fn() }
    },
    tabs: {
        query: jest.fn(),
        create: jest.fn(),
        remove: jest.fn()
    },
    runtime: {
        onMessage: { addListener: jest.fn() },
        sendMessage: jest.fn()
    }
};

export default chromeMock;