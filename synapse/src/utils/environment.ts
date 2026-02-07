
console.log('Initializing environment variables...');

/**
 * Logs the vlaue of an environment variable and returns it.
 * @param envVariable name of the environment variable
 * @returns the value of the environment variable.
 */
function getEnv(envVariable: string): string | undefined {
    console.log(`- ${envVariable}: ${process.env[envVariable]}`);
    return process.env[envVariable];
}

/**
 * Whether to allow the project to commit and push changes to the repository. Expected to be stringified boolean value ('true' or 'false').
 * @default false - do not auto commit by default.
 */
export const enableAutoCommit = getEnv('ENABLE_AUTO_COMMIT') === 'true';