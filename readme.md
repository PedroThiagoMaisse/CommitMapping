# CommitMapping
An executable Node script that searches for all git repositories on your machine, stores the commits you made in each of them, and uploads a mirror of them to the desired project.

This mirror includes the following information:
- Commit code
- Author
- Date
- Commit description
- Number of lines deleted, added, and modified

**There is no information about the nature of the project from which the commit originates or code snippets.**

## Running

Use ***In a console with admin access***
> Npx commitMapping

Or clone it to your machine and use
> node . --lookoutpath c:/Users

inside the repository.

## Variables

These are the variables that the code uses:

| Name          | Description                                             | Default                  | Alias       |
| ------------- | ------------------------------------------------------- | ------------------------ | ----------- |
| COMMITPATH    | Path to store the script                                | C:/commitMapping         | commitpath  |
| LOOKOUTPATH   | Path where the crawler starts                           | C:/Users                 | lookoutpath |
| DRY-RUN       | Prevents pushing data to the project                    | False                    | dry-run     |
| TEST          | Prevents pushing data to the project                    | False                    | test        |
| AUTHOR        | The email used as a filter in commits                   | *filled in dialogue*     | author      |
| PROJECTURL    | The project URL where commits will be made              | *filled in dialogue*     | project     |
| TOKEN         | An access token for the account                         | *filled in dialogue*     | token       |
| FORCE         | Can be used to bypass some checks                      | false                    | force       |

They can be set using flags, such as:
> npx commitmapping --author example.email --project https://... --token ghpz... --commitpath c:// --lookoutpath c:// --test --force

## Next Steps
V 1.3 (Simple rewrites + bug handling) *(Live Now!)* 
- ~Bugs (1/1)~
    - ~Delay in writing variables to process.env (false alarm)~

- ~Improvements / Rewrites~
    - ~Change the language of this readme to English~
    - ~Review the code (5/5)~
        - ~Git Controller~
            - ~Make one more function run in parallel~
            - ~Review the step-by-step logic of Modify and Commit~
        - ~Phaser~
        - ~Wrapper (is there an easier way to do it?)~
        - ~Study the separation of services into services + utils and the use of functions~
        - ~Services~

V 2.0 (Pipeline automation + Test creation)
<details>

- Test creation
    - ~New variable~
    - Create temp and check if it exists
    - Clone a repository
        - Make the crawler run by fetching some other projects
        - Check the commits in these projects

- DevOps
    - ~Create a new branch for testing and PRD~
    - Git Actions (1/4)
        - ~Push from master to PRD~
        - Push from PRD to NPM
        - Automatic tests on the dev branch
        - Perform tests before pushing from master to PRD
</details>

# Future Improvements

<details>

- Bugs (0/1)
    - File lock issues (how to replicate in the first place)

- Identify major performance problems (0/1)
    - The file commit section

</details>

## Completed

<details>

V 0 to 1.2.0
- Bugs
    - Improve the commit execution loop
    - Clone only .git
    - For some projects, git log doesn't return
    - Organize language files
    - --test and --dryrun don't lock or lock everything
    - Bug in time
    - Bug in the case of an existing project

- Improvements/Rewrites
    - Provide in English
    - new code order:
        - get envs
        - get language
        - console.clear
        - start flux
        - (Re) Organize files;
    - Try to move files to some temp location
    - Create an error pattern in case of failures before we get the filepath (with the change of exec function to cwd, it became redundant);
    - Improve logic for switching operating systems and languages (with the change to the standardization of the node exec function, it became agnostic to the operating system and language);
    - Try to change the commit date through git API options (or changing environment variables);
    - Create an error wrapper;
    - Improve system output log;
    - In commit details, include the number of lines;
    - In commit details, include the project name; (could be considered information leakage)
    - Do not duplicate commits and do not delete the current file;
    - Improve readme readability;
    - Create a test case that does not push;
    - Fix environment variables to include email, token, and repo;
    - Store commits that failed;
    - More complete error handler;
    - Handle kill switches;
    - Add new variables to ReadMe;
    - DeleteFile function in utils;
    - Change the way the crawler works to avoid the recurrence of the function;
    - Adjustments in writing and new tasks;
    - Break the Born() in phaser;
    - Get the current directory and use it to build default routes;
    - Allow multiple processes to occupy the thread when running in a loop;
    - Break the modifyAndCommit() in git.controller;
    - Token and URL are hardcoded;

DevOps
    - Push to NPX (and maybe change the name);
        - Use locally in the pointed directory (when switching to npx)

</details>