async function initMembersDropdown() {
    //getting the members
    const response = await fetch("/api/get_member_list");
    const members = await response.json();
    console.log(members);
    fillDropdown(members)
}

console.log("test");

function fillDropdown(members) {
    const dropdown = document.getElementById('membersDropdown');
    console.log("test2");

    while (dropdown.options.length > 1) {
        dropdown.remove(1);
    }

    for (let i = 0; i < members.length; i++) {
        let option = document.createElement('option');
        option.value = members[i].fname;
        option.textContent = `${members[i].fname} ${members[i].lname}`;
        dropdown.appendChild(option);
    }
}
initMembersDropdown();