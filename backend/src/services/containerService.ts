import Docker from 'dockerode';

const docker = new Docker();

// Creates a simple container with a node image to run JS code.
// For the full app, you'd manage a pool of these.
export const createExecutionContainer = async () => {
  const container = await docker.createContainer({
    Image: 'node:18-alpine',
    Tty: true, // Important for interactive terminal
    Cmd: ['/bin/sh'], // Command to keep the container alive
    HostConfig: {
      AutoRemove: true, // Cleans up the container when it stops
    }
  });

  await container.start();
  return container;
};

export const executeCommandInContainer = async (container: Docker.Container, command: string[]) => {
  const exec = await container.exec({
    Cmd: command,
    AttachStdout: true,
    AttachStderr: true,
  });

  const stream = await exec.start({ hijack: true, stdin: true });
  
  // For the MVP, we can just return the buffered output.
  // For the real thing, you'll stream this over a WebSocket.
  return new Promise((resolve, reject) => {
    let output = '';
    stream.on('data', (chunk) => output += chunk.toString('utf8'));
    stream.on('end', () => resolve(output));
    stream.on('error', reject);
  });
};