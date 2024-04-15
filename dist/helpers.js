"use strict";
function getFormData(object) {
    const formData = new FormData();
    Object.keys(object).forEach((key) => formData.append(key, object[key]));
    return formData;
}
function getMailCode(msg) {
    return msg.subject.replace("Your confirmation code is: ", "");
}
function getHeaders(signInToken) {
    return {
        headers: {
            "Content-Type": "multipart/form-data; boundary=----WebKitFormBoundaryzLd7iJHRU5f9lXib",
            Authorization: `Bearer ${signInToken}`,
        },
    };
}
function generateRandomUsername() {
    const usernames = [
        "John",
        "Jane",
        "Alice",
        "Bob",
        "Emma",
        "Michael",
        "Sophia",
        "William",
        "Vitalii"
    ];
    const randomIndex = Math.floor(Math.random() * usernames.length);
    return usernames[randomIndex];
}
function generateRandomJob() {
    const jobs = [
        "Software Developer",
        "Data Analyst",
        "Project Manager",
        "Graphic Designer",
        "Financial Analyst",
        "Marketing Manager",
        "Sales Representative",
        "Human Resources Manager",
        "Customer Service Representative",
        "Accountant",
        "Web Developer",
        "Business Analyst",
        "Operations Manager",
        "Administrative Assistant",
        "Teacher",
        "Nurse",
        "Engineer",
        "Lawyer",
        "Electrician",
        "Chef",
    ];
    const randomIndex = Math.floor(Math.random() * jobs.length);
    return jobs[randomIndex];
}
function generateRandomSurname() {
    const surnames = [
        "Smith",
        "Johnson",
        "Williams",
        "Jones",
        "Brown",
        "Davis",
        "Miller",
        "Wilson",
        "Moore",
        "Taylor",
        "Anderson",
        "Thomas",
        "Jackson",
        "White",
        "Harris",
        "Martin",
        "Thompson",
        "Garcia",
        "Martinez",
        "Robinson",
    ];
    const randomIndex = Math.floor(Math.random() * surnames.length);
    return surnames[randomIndex];
}
function generateRandomNumbers() {
    const numbers = [];
    for (let i = 0; i < 9; i++) {
        const randomNumber = Math.floor(Math.random() * 100) + 1;
        numbers.push(randomNumber);
    }
    return numbers;
}
exports.getFormData = getFormData;
exports.getMailCode = getMailCode;
exports.getHeaders = getHeaders;
exports.generateRandomUsername = generateRandomUsername;
exports.generateRandomSurname = generateRandomSurname;
exports.generateRandomNumbers = generateRandomNumbers;
exports.generateRandomJob = generateRandomJob;
