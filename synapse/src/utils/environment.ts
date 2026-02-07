
console.log('Initializing environment variables...');

/**
 * Retrieves and parses an environment variable.
 * @param envVariable name of the environment variable
 * @param parser A function that transforms the raw string value into the desired type. Receives undefined if the variable is not set.
 * @returns The transformed value of the environment variable.
 */
function getEnv<T>(envVariable: string, parser: (value: string | undefined) => T): T {
    console.log(`- ${envVariable}: ${process.env[envVariable]}`);
    return parser(process.env[envVariable]);
}

/**
 * Whether to allow the project to commit and push changes to the repository. Expected to be stringified boolean value ('true' or 'false').
 * @default false - do not auto commit by default.
 */
export const enableAutoCommit = getEnv('ENABLE_AUTO_COMMIT', (envVarValue) => envVarValue === 'true');