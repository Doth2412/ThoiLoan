const fs = require('fs');
const path = require('path');

const RES_DIR = path.join(__dirname, 'res');
const RESOURCE_JS = path.join(__dirname, 'src', 'data', 'Resource.js');

/**
 * Generates a resource key from a file path, optionally prepending directory parts.
 *
 * @param {string} filePath - The full path to the resource file.
 * @param {string[]} [dirPartsToPrepend=[]] - An array of directory names to prepend (closest first).
 * @returns {string} The generated resource key (e.g., 'main_scene_json', 'idle_image0000_png').
 */
function generateKey(filePath, dirPartsToPrepend = []) {
    const filename = path.basename(filePath); // e.g. MainScene.json
    const ext = path.extname(filename).slice(1); // e.g. 'json'
    const base = path.basename(filename, '.' + ext); // e.g. 'MainScene'

    // Convert base filename to snake_case
    const snakeCaseBase = base
        .replace(/([a-z0-9])([A-Z])/g, '$1_$2') // insert _ between camelCase words
        .replace(/[\s\-]/g, '_') // replace spaces/hyphens with _
        .toLowerCase(); // convert to lowercase

    // Convert directory parts to snake_case and join them
    const snakeCasePrefix = dirPartsToPrepend
        .map(part => part
            .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
            .replace(/[\s\-]/g, '_')
            .toLowerCase()
        )
        .join('_');

    // Combine prefix and base
    let combined = snakeCasePrefix ? `${snakeCasePrefix}_${snakeCaseBase}` : snakeCaseBase;

    // Add underscore prefix if the name starts with a number
    const prefixedName = /^\d/.test(combined) ? '_' + combined : combined;

    return `${prefixedName}_${ext}`; // e.g. main_scene_json or idle_image0000_png
}


/**
 * Recursively walks a directory, collecting file paths, excluding specified directories.
 *
 * @param {string} dir - The directory to walk.
 * @returns {string[]} An array of full file paths.
 */
function walk(dir) {
    const excludedDirs = [
        // Add any directories you want to exclude here
        // path.join(RES_DIR, 'Art/Troops'),
    ];

    let files = [];

    if (!fs.existsSync(dir)) {
        console.log(`Creating directory: ${dir}`);
        fs.mkdirSync(dir, { recursive: true });
        return files;
    }

    for (const file of fs.readdirSync(dir)) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            const shouldExclude = excludedDirs.some(excluded =>
                path.resolve(fullPath) === path.resolve(excluded)
            );

            if (shouldExclude) {
                console.log(`Skipping excluded directory: ${fullPath}`);
                continue;
            }

            files = files.concat(walk(fullPath));
        } else {
            // Ignore system/hidden files like .DS_Store
            if (!/^\./.test(file)) {
                files.push(fullPath);
            }
        }
    }

    return files;
}

/**
 * Logs a summary of resource files found, grouped by directory.
 *
 * @param {string[]} files - An array of full file paths.
 */
function summarizeResources(files) {
    const dirCount = {};

    files.forEach(file => {
        const dir = path.dirname(path.relative(RES_DIR, file));
        dirCount[dir] = (dirCount[dir] || 0) + 1;
    });

    console.log('\nResource Summary:');
    console.log('----------------');

    Object.keys(dirCount).sort().forEach(dir => {
        console.log(`${dir}: ${dirCount[dir]} files`);
    });

    console.log(`\nTotal: ${files.length} resources`);
}

/**
 * Parses the existing Resource.js file to extract current key-value pairs.
 * It maps file paths back to their keys to help preserve them.
 *
 * @param {string} filePath - The path to Resource.js.
 * @returns {object} A map where keys are relative file paths and values are their existing keys.
 */
function parseExistingResources(filePath) {
    const valueToKeyMap = {}; // We map: 'filePath' -> 'key'
    if (!fs.existsSync(filePath)) {
        return valueToKeyMap;
    }

    const content = fs.readFileSync(filePath, 'utf8');
    const resBlockMatch = content.match(/var res = \{([\s\S]*?)\};/);

    if (!resBlockMatch || !resBlockMatch[1]) {
        console.warn('Could not find or parse existing "var res" block.');
        return valueToKeyMap;
    }

    const resContent = resBlockMatch[1];
    const pairRegex = /\s*([\w_]+)\s*:\s*'([^']+)'\s*,?/g;

    let match;
    while ((match = pairRegex.exec(resContent)) !== null) {
        const key = match[1];
        const value = match[2];
        valueToKeyMap[value] = key;
    }

    console.log(`Parsed ${Object.keys(valueToKeyMap).length} existing resource entries.`);
    return valueToKeyMap;
}

/**
 * Updates or creates the Resource.js file with current resource information,
 * handling potential key collisions and preserving existing keys.
 */
function updateResourceFile() {
    if (!fs.existsSync(RESOURCE_JS)) {
        console.error('Resource.js not found at:', RESOURCE_JS);
        // Create an empty file structure if it doesn't exist.
        console.log('Creating empty Resource.js.');
        const dir = path.dirname(RESOURCE_JS);
        if (!fs.existsSync(dir)) {
             fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(RESOURCE_JS, 'var res = {};\n\nvar g_resources = [];', 'utf8');
    }

    // 1. Parse existing resources FIRST to preserve keys.
    const existingValueToKeyMap = parseExistingResources(RESOURCE_JS);

    // 2. Walk the directory.
    const files = walk(RES_DIR);
    console.log(`Found ${files.length} resource files`);

    const newResMap = {}; // key -> relPath
    const keyToPathMap = {}; // key -> relPath (for quick key collision checks)

    // 3. Populate with existing keys first to give them priority.
    files.forEach(file => {
        const relPath = path.relative(RES_DIR, file).replace(/\\/g, '/');
        if (existingValueToKeyMap.hasOwnProperty(relPath)) {
            const key = existingValueToKeyMap[relPath];
            // Check for potential key collisions even among existing keys (unlikely but possible).
            if (keyToPathMap.hasOwnProperty(key) && keyToPathMap[key] !== relPath) {
                 console.warn(`WARNING: Existing key '${key}' maps to multiple files! ` +
                               `Keeping '${keyToPathMap[key]}' and generating new for '${relPath}'.`);
            } else {
                 newResMap[key] = relPath;
                 keyToPathMap[key] = relPath;
            }
        }
    });

    // 4. Process all files, generating new keys if needed and handling collisions.
    files.forEach(file => {
        const relPath = path.relative(RES_DIR, file).replace(/\\/g, '/');

        // If it already has a key (processed above), skip it.
        if (Object.values(newResMap).includes(relPath)) {
            return;
        }

        const dirParts = path.dirname(relPath).split('/').filter(p => p && p !== '.');
        let partsToPrepend = [];
        let currentKey = generateKey(file, partsToPrepend);
        let level = 0;

        // Loop until we find a unique key.
        while (keyToPathMap.hasOwnProperty(currentKey)) {
            console.log(`Collision detected for key '${currentKey}' (File: ${relPath}). Generating new key.`);

            level++;
            if (level > dirParts.length) {
                // If we've used all parts, start adding numbers.
                let i = 1;
                let baseAttempt = generateKey(file, dirParts);
                do {
                   currentKey = `${baseAttempt}_${i}`;
                   i++;
                } while (keyToPathMap.hasOwnProperty(currentKey));
                console.warn(`Deep collision, using numbered key: ${currentKey}`);
            } else {
                // Add the next directory part from the end (closest first).
                partsToPrepend = dirParts.slice(-level);
                currentKey = generateKey(file, partsToPrepend);
            }
        }

        // Found a unique key, add it.
        newResMap[currentKey] = relPath;
        keyToPathMap[currentKey] = relPath;
    });


    // 5. Build the 'resEntries' string (sorted for consistency).
    const sortedKeys = Object.keys(newResMap).sort();
    const resEntries = sortedKeys.map(key => {
        const relPath = newResMap[key];
        return `    ${key} : '${relPath}',`;
    }).join('\n');

    // 6. Build 'g_resources' (simple list of current files, sorted).
    const gResourcesEntries = files
        .map(file => path.relative(RES_DIR, file).replace(/\\/g, '/'))
        .sort() // Sort for consistency
        .map(relPath => `    "${relPath}",`)
        .join('\n');

    // 7. Read/Update Resource.js.
    let content = fs.readFileSync(RESOURCE_JS, 'utf8').trim();
    if (!content) {
        content = 'var res = {};\n\nvar g_resources = [];';
    }

    const newResBlock = `var res = {\n${resEntries}\n};`;
    const gResourcesBlock = `var g_resources = [\n${gResourcesEntries}\n];`;

    let updated = content.replace(/var res = \{[\s\S]*?\};/, newResBlock);
    // Ensure g_resources update works even if it's empty or formatted differently.
    if (/var g_resources = \[\s*[\s\S]*?\];/.test(updated)) {
         updated = updated.replace(/var g_resources = \[\s*[\s\S]*?\];/, gResourcesBlock);
    } else {
        // If g_resources wasn't found (maybe empty file), append it.
         updated += `\n\n${gResourcesBlock}`;
    }


    fs.writeFileSync(RESOURCE_JS, updated, 'utf8');
    console.log('Resource.js updated successfully (preserving keys and handling collisions)');

    summarizeResources(files);
}

// Run the update process.
updateResourceFile();