import { NodeSSH } from 'node-ssh';
import path from 'path';
import fs from 'fs/promises';
import os from 'os';

// Configuration for your VM.
const vmConfig = {
  host: process.env.VM_HOST,
  username: process.env.VM_USERNAME,
  privateKeyPath: process.env.VM_PRIVATE_KEY_PATH,
};

/**
 * Orchestrates the creation and launch of a Firecracker microVM.
 * @param files - A map of filenames to their content.
 * @returns The public URL of the running application inside the microVM.
 */
export const runCodeInVM = async (files: { [key:string]: string }) => {
  // === FIX IS HERE: Validate environment variables inside the function ===
  // This allows TypeScript to correctly narrow the types for the rest of the function.
  if (!vmConfig.host || !vmConfig.username || !vmConfig.privateKeyPath) {
    // Log the error for easier debugging on the server side.
    console.error("Missing required VM environment variables. Check your .env file.");
    throw new Error("Server configuration is incomplete. Missing VM environment variables.");
  }
  // ======================================================================

  const connection = new NodeSSH();
  const sessionId = `session_${Date.now()}`;
  const localTempDir = await fs.mkdtemp(path.join(os.tmpdir(), `upload-${sessionId}-`));
  
  try {
    // 1. Write in-memory files to the local temporary directory
    for (const fileName in files) {
      const content = files[fileName];
      const localPath = path.join(localTempDir, fileName);
      await fs.writeFile(localPath, content);
    }

    // 2. Connect to the remote VM (No "!" needed now)
    await connection.connect({
      host: vmConfig.host,
      username: vmConfig.username,
      privateKeyPath: vmConfig.privateKeyPath,
    });

    // 3. Create a unique project directory on the remote VM
    const remoteProjectDir = `/tmp/${sessionId}_project_files`;
    await connection.execCommand(`mkdir -p ${remoteProjectDir}`);

    // 4. Upload the entire temporary directory to the remote host
    const putResult = await connection.putDirectory(localTempDir, remoteProjectDir, {
      recursive: true,
      concurrency: 10,
    });

    if (!putResult) {
        throw new Error('Failed to upload project files to the VM.');
    }

    // 5. Execute the orchestration script on the host VM
    const command = `bash ~/launch_microvm.sh ${remoteProjectDir} ${sessionId}`;
    const result = await connection.execCommand(command);

    if (result.code !== 0) {
      throw new Error(`VM orchestration script failed with code ${result.code}: ${result.stderr}`);
    }

    // 6. The stdout of the script is our URL
    const publicUrl = result.stdout.trim();
    if (!publicUrl.startsWith('http')) {
      throw new Error(`Script did not return a valid URL. Output: ${publicUrl}`);
    }

    // Clean up the project files on the host VM
    await connection.execCommand(`rm -rf ${remoteProjectDir}`);

    return {
      success: true,
      message: 'MicroVM started successfully.',
      url: publicUrl
    };

  } catch (error) {
    console.error('Failed to execute code in VM:', error);
    throw error;
  } finally {
    // 7. Clean up the local temporary directory and close the connection
    await fs.rm(localTempDir, { recursive: true, force: true });
    if (connection.isConnected()) {
      connection.dispose();
    }
  }
};