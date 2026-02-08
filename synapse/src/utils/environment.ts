
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
/**
 * Whether to write any changes to local files. Expected to be stringified boolean value ('true' or 'false').
 * Implementation note: Intended to be a local development feature to avoid changing files when testing.
 * @default false - does not write to any file by default.
 */
export const enableFileWrite = getEnv('ENABLE_FILE_WRITE') === 'true';

/**
 * Whether to use a generic bot author name for git commits (e.g. "Synapse Bot") instead of the local git user.name and user.email. Expected to be stringified boolean value ('true' or 'false').
 * Implementation note: Intended to be a local development feature to avoid changing local git configuration when testing (i.e. don't use git config for actual changes made in the project)
 * @default false - does not use generic bot author by default.
 */
export const enableGitBotAuthor = getEnv('ENABLE_GIT_BOT_AUTHOR') === 'true';