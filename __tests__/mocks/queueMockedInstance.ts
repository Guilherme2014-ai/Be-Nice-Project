import Queue from "bull";

const queueMockedClass = <jest.Mock<Queue.Queue>>Queue;
const queueMockednstancee = queueMockedClass.mock.instances[0]; // Prestar Atenção nesta Propriedade...

export { queueMockednstancee };
