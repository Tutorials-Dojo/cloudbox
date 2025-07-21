import { NodeSSH } from 'node-ssh';
import path from 'path';

// Configuration for your VM.
// Ensure you have a .env file in the backend/ directory with these variables.
const vmConfig = {
  host: process.env.VM_HOST,
  username: process.env.VM_USERNAME,
  privateKeyPath: process.env.VM_PRIVATE_KEY_PATH,
};

if (!vmConfig.host || !vmConfig.username || !vmConfig.privateKeyPath) {
    throw new Error("Missing required VM environment variables (VM_HOST, VM_USERNAME, VM_PRIVATE_KEY_PATH).");
}

/**
 * Orchestrates the creation and launch of a Firecracker microVM.
 * @param files - A map of filenames to their content.
 * @returns The public URL of the running application inside the microVM.
 */
export const runCodeInVM = async (files: { [key:string]: string }) => {
  const connection = new NodeSSH();
  try {
    await connection.connect(vmConfig);

    // 1. Create a unique ID for this execution session
    const sessionId = `session_${Date.now()}`;
    const remoteProjectDir = `/tmp/${sessionId}_project_files`;
    await connection.execCommand(`mkdir -p ${remoteProjectDir}`);

    // 2. Upload user's project files to the host VM
    const localTempDir = path.join(__dirname, '..', '..', 'temp_uploads');
    const putFileOptions = {
        concurrency: 10
    };
    await connection.putDirectory(localTempDir, remoteProjectDir, {
      ...putFileOptions,
      // Create an in-memory representation of the user's files
      // This is a workaround because putDirectory works with the local filesystem.
      // A more robust solution might write to a temp dir locally first.
      // For this step, we will upload one by one.
    });

    // Let's upload files one-by-one as it's simpler with in-memory content
    for (const fileName in files) {
        const content = files[fileName];
        const remotePath = path.join(remoteProjectDir, fileName);
        await connection.put(Buffer.from(content), remotePath);
    }
    
    // 3. Execute the orchestration script on the host VM
    // The script will create, configure, and launch the microVM.
    // It will print the public URL as its final output.
    const command = `bash ~/launch_microvm.sh ${remoteProjectDir} ${sessionId}`;
    
    const result = await connection.execCommand(command);

    if (result.code !== 0) {
        // If the script failed, throw an error with the details
        throw new Error(`VM orchestration script failed with code ${result.code}: ${result.stderr}`);
    }

    // 4. The stdout of the script is our URL
    const publicUrl = result.stdout.trim();

    if (!publicUrl.startsWith('http')) {
        throw new Error(`Script did not return a valid URL. Output: ${publicUrl}`);
    }

    // Clean up the uploaded project files on the host (optional)
    await connection.execCommand(`rm -rf ${remoteProjectDir}`);

    return {
      success: true,
      message: 'MicroVM started successfully.',
      url: publicUrl
    };

  } catch (error) {
    console.error('Failed to execute code in VM:', error);
    throw error; // Re-throw to be handled by the route
  } finally {
    if (connection.isConnected()) {
      connection.dispose();
    }
  }
};