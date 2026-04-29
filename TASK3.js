const fs = require("fs");
const readline = require("readline");

const FILE_NAME = "contacts.json";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Load contacts
function loadContacts() {
    if (fs.existsSync(FILE_NAME)) {
        return JSON.parse(fs.readFileSync(FILE_NAME));
    }
    return [];
}

// Save contacts
function saveContacts(contacts) {
    fs.writeFileSync(FILE_NAME, JSON.stringify(contacts, null, 2));
}

// Display contacts 
function displayContacts(contacts) {
    console.log("\n Contact List:");
    contacts.forEach((c, i) => {
        console.log(`${i + 1}. ${c.name} | ${c.phone} | ${c.email}`);
    });
    console.log();
}

// Add Contact
function addContact() {
    rl.question("Enter Name: ", (name) => {
        rl.question("Enter Phone: ", (phone) => {
            rl.question("Enter Email: ", (email) => {

                const contacts = loadContacts();
                contacts.push({ name, phone, email });

                saveContacts(contacts);
                console.log(" Contact added!\n");

                menu();
            });
        });
    });
}

// View Contacts
function viewContacts() {
    const contacts = loadContacts();

    if (contacts.length === 0) {
        console.log("No contacts found.\n");
    } else {
        displayContacts(contacts);
    }

    menu();
}

// Edit Contact (FIXED)
function editContact() {
    const contacts = loadContacts();

    if (contacts.length === 0) {
        console.log("No contacts to edit.\n");
        return menu();
    }

    displayContacts(contacts);

    rl.question("Enter contact number to edit: ", (num) => {
        const index = parseInt(num) - 1;

        if (contacts[index]) {
            rl.question("New Name: ", (name) => {
                rl.question("New Phone: ", (phone) => {
                    rl.question("New Email: ", (email) => {

                        contacts[index] = { name, phone, email };
                        saveContacts(contacts);

                        console.log(" Contact updated!\n");
                        menu();
                    });
                });
            });
        } else {
            console.log(" Invalid number.\n");
            menu();
        }
    });
}

// Delete Contact (FIXED)
function deleteContact() {
    const contacts = loadContacts();

    if (contacts.length === 0) {
        console.log("No contacts to delete.\n");
        return menu();
    }

    displayContacts(contacts);

    rl.question("Enter contact number to delete: ", (num) => {
        const index = parseInt(num) - 1;

        if (contacts[index]) {
            const removed = contacts.splice(index, 1);
            saveContacts(contacts);

            console.log(` Deleted: ${removed[0].name}\n`);
        } else {
            console.log(" Invalid number.\n");
        }

        menu();
    });
}

// Search Contact
function searchContact() {
    const contacts = loadContacts();

    rl.question("Enter name to search: ", (search) => {
        const results = contacts.filter(c =>
            c.name.toLowerCase().includes(search.toLowerCase())
        );

        if (results.length === 0) {
            console.log("No contact found.\n");
        } else {
            console.log("\n🔍 Results:");
            results.forEach(c => {
                console.log(`${c.name} | ${c.phone} | ${c.email}`);
            });
            console.log();
        }

        menu();
    });
}

// Menu
function menu() {
    console.log("====== Contact Manager ======");
    console.log("1. Add Contact");
    console.log("2. View Contacts");
    console.log("3. Edit Contact");
    console.log("4. Delete Contact");
    console.log("5. Search Contact");
    console.log("6. Exit");

    rl.question("Choose option: ", (choice) => {
        switch (choice.trim()) {
            case "1":
                addContact();
                break;
            case "2":
                viewContacts();
                break;
            case "3":
                editContact();
                break;
            case "4":
                deleteContact();
                break;
            case "5":
                searchContact();
                break;
            case "6":
                console.log("Goodbye!");
                rl.close();
                break;
            default:
                console.log("Invalid option.\n");
                menu();
        }
    });
}

// Start
menu();