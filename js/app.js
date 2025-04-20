/* ==========================================================================
Constants, Variables, Data
========================================================================== */
const FORM_USER_INPUT = document.getElementById("form_user_input");
const INPUT_SUBJECT_NAME = document.getElementById("input_subject_name");
const TEXTAREA_ACTIVITY_DETAILS = document.getElementById("textarea_activity_details");
const BUTTON_SUBMIT_USER_INPUT = document.getElementById("button_submit_user_input");

const BUTTON_ACTIVITY_TOGGLE = document.getElementById("button_activity_toggle");
const BUTTON_CONTAINER = document.getElementById("button_container");

const INVISIBLE_IMAGE = new Image();
INVISIBLE_IMAGE.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciLz4=";

// Start from 2 because the first row is the header
const MAP_TIME_TO_TIMETABLE_ROW = new Map([
    ["07:00", 2],
    ["07:30", 3],
    ["08:00", 4],
    ["08:30", 5],
    ["09:00", 6],
    ["09:30", 7],
    ["10:00", 8],
    ["10:30", 9],
    ["11:00", 10],
    ["11:30", 11],
    ["12:00", 12],
    ["12:30", 13],
    ["13:00", 14],  // 1:00 PM
    ["13:30", 15],  // 1:30 PM
    ["14:00", 16],  // 2:00 PM
    ["14:30", 17],  // 2:30 PM
    ["15:00", 18],  // 3:00 PM
    ["15:30", 19],  // 3:30 PM
    ["16:00", 20],  // 4:00 PM
    ["16:30", 21],  // 4:30 PM
    ["17:00", 22],  // 5:00 PM
    ["17:30", 23],  // 5:30 PM
    ["18:00", 24],  // 6:00 PM
    ["18:30", 25],  // 6:30 PM
    ["19:00", 26],  // 7:00 PM
    ["19:30", 27],  // 7:30 PM
    ["20:00", 28],  // 8:00 PM
    ["20:30", 29],  // 8:30 PM
    ["21:00", 30],  // 9:00 PM
    ["21:30", 31]   // 9:30 PM
]);

/* ==========================================================================
Event Listeners
========================================================================== */
BUTTON_SUBMIT_USER_INPUT.addEventListener("click", (event) => {
    // Guard statements :: User did not provide required inputs
    if (INPUT_SUBJECT_NAME.value.trim() === "") {
        return false;
    }
    if (TEXTAREA_ACTIVITY_DETAILS.value.trim() === "") {
        return false;
    }

    // This needs to be after checking if the user provided the
    // required inputs. This is because preventDefault() will
    // prevent the native popup for not filling out a field.
    event.preventDefault();

    const activity_details = Process_Activity_Details();

    // Guard statement :: User input is invalid
    if (activity_details.length < 2) {
        console.warn("Invalid activity details");

        Handle_Invalid_Activity_Input();

        return false;
    }
    // More input validation would be nice... too bad!

    // Create subject and register it
    const new_subject = new Subject(INPUT_SUBJECT_NAME.value, activity_details);
    SUBJECT_CONTROLLER.Register_New_Subject(new_subject);

    FORM_USER_INPUT.reset();
});

BUTTON_ACTIVITY_TOGGLE.addEventListener("click", (event) => {
    event.preventDefault();

    if (BUTTON_ACTIVITY_TOGGLE.getAttribute("aria-pressed") === 'false') {
        // User wants to see all dropzones
        SUBJECT_CONTROLLER.Update_User_Preference_For_Dropzone_Visibility(true);

        BUTTON_ACTIVITY_TOGGLE.setAttribute("aria-pressed", true);

        // Set text
        const button_front = BUTTON_ACTIVITY_TOGGLE.querySelector(".button__front");
        button_front.textContent = "All timeslots visible: ON";
    } 
    else {
        // User does not want to see all dropzones
        SUBJECT_CONTROLLER.Update_User_Preference_For_Dropzone_Visibility(false);

        BUTTON_ACTIVITY_TOGGLE.setAttribute("aria-pressed", false);

        // Set text
        const button_front = BUTTON_ACTIVITY_TOGGLE.querySelector(".button__front");
        button_front.textContent = "All timeslots visible: OFF";
    }
});
/* ==========================================================================
Functions
========================================================================== */
function Process_Activity_Details() {
    const user_input =  TEXTAREA_ACTIVITY_DETAILS.value.trim();
    // Result:
    //   ["Activity Day Time Free Campus Location Duration Weeks Description
    //   01 Tue 13:30 10 BRUCE Building 7 2 hrs ... ..."]

    const array_of_lines = user_input.split('\n');
    // Result:
    //   ["Activity Day Time Free Campus Location Duration Weeks Description"],
    //   ["01 Tue 13:30 10 BRUCE Building 7... 2 hrs ... ..."],

    let activity_details_2d_array = array_of_lines.map(
        // Convert lines into 2D array 
        line => line.trim().split('\t')
        // Trim whitespace off each element
        .map(element => element.trim())
    )
    // Result:
    //   ["Activity", "Day", "Time", "Free", "Campus", "Location", "Duration", "Weeks", "Description"],
    //   ["01", "Tue", "13:30", "10", "BRUCE", "Building 7...", "2 hrs", "...", "..."],

    // Discard the top row
    activity_details_2d_array.shift();

    return activity_details_2d_array;
}

function Handle_Invalid_Activity_Input() {
    // Using custom validity for the native popover message
    TEXTAREA_ACTIVITY_DETAILS.setCustomValidity("Invalid activity details");
    TEXTAREA_ACTIVITY_DETAILS.reportValidity();
    // The above method causes the input to be permanently invalid, so reset immediately
    TEXTAREA_ACTIVITY_DETAILS.setCustomValidity("");
    // Clearing the textarea value does two things:
    // 1. It clears the input (obvious)
    // 2. Less obviously, it is the reason the input is outlined red because it now
    //    meets the :user-invalid condition
    TEXTAREA_ACTIVITY_DETAILS.value = "";
}

/* ==========================================================================
Classes & Custom Elements
========================================================================== */
//-----------------------------------------------------------------------------
// Purpose: Last minute hack for controlling all subjects. Responsible for
//          handling timetable settings and propogating these settings across
//          all subjects.
//-----------------------------------------------------------------------------
class Subject_Controller {
    constructor() {
        this.list_of_subjects = []
        this.dropzone_user_preference = false;
    }

    Register_New_Subject(subject) {
        this.list_of_subjects.push(subject);

        subject.Set_Dropzones_Forced_Status(this.dropzone_user_preference);
    }

    Deregister_Subject(subject) {
        this.list_of_subjects = this.list_of_subjects.filter(list_item => list_item !== subject);
    }

    Update_User_Preference_For_Dropzone_Visibility(bool) {
        this.dropzone_user_preference = bool;

        this.list_of_subjects.forEach(subject => {
            subject.Set_Dropzones_Forced_Status(this.dropzone_user_preference);
        });
    }
}
//-----------------------------------------------------------------------------
// Purpose: The Subject class is responsible for creating and controlling
//          activities. It also creates cards and listens for card drag events.
//-----------------------------------------------------------------------------
class Subject {
    static id_counter = 0;

    constructor(subject_name, activity_details) {
        this.id =               Subject.id_counter;
        this.name =             subject_name;
        this.color =            this.Generate_Random_Subject_color();
        this.dropzones_forced = false;

        Subject.id_counter++;

        this.Create_Activities(activity_details);
        this.Add_Activities_To_Timetable();
        this.Create_Delete_Subject_Button();
    }

    Create_Activities(activity_details) {
        // For each activity array: create a web component and initialize with activity info
        // Then return / add the activity to the activities_list
        this.activities_list = activity_details.map(activity => {
            const activity_wc = document.createElement('activity-wc');
            activity_wc.Initialize(this, activity);
            return activity_wc;
        })
    }

    Add_Activities_To_Timetable() {
        // Activity web components already exist in memory (activities_list)
        // This function appends them to the DOM
        this.activities_list.forEach((activity, index) => {
            // Get the activity container and append the activity
            const activity_container = document.getElementById(`${activity.day}`);
            const activity_wc = activity_container.appendChild(activity);

            // Create a card in the first activity only
            if (index === 0) {
                this.Create_Card(activity_wc);
            }
        });

        if (this.dropzones_forced) {
            this.Show_Dropzones();
        }
    }

    Create_Card(activity_wc) {
        // Create the card and append it to the first <activity-wc>
        const card = document.createElement('card-wc');
        activity_wc.appendChild(card);

        // Initialize the card and listen for card events
        card.Initialize(this);
        this.Listen_For_Card_Events(card)
    }

    Listen_For_Card_Events(card) {
        card.addEventListener("dragstart", (event) => {
            this.Show_Dropzones();
        });

        card.addEventListener("dragend", (event) => {
            this.Hide_Dropzones();
        });
    }

    Set_Dropzones_Forced_Status(bool) {
        this.dropzones_forced = bool;

        if (this.dropzones_forced === true) {
            this.Show_Dropzones();
        }
        else {
            this.Hide_Dropzones();
        }
    }

    Show_Dropzones() {
        this.activities_list.forEach(activity => {
            activity.classList.add("activity--dropzone");
        });
    }

    Hide_Dropzones() {
        // Guard statement :: User wants dropzones to always be visible
        if (this.dropzones_forced) {
            return;
        }

        this.activities_list.forEach(activity => {
            activity.classList.remove("activity--dropzone");
        });
    }

    Generate_Random_Subject_color() {
        return `#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}`;
    }

    Create_Delete_Subject_Button() {
        const template = document.createElement("template");
        template.innerHTML = 
        `<button class="button | button--delete" style="--_btn-clr-bg: ${this.color};">
            <span class="button__shadow"></span>
            <span class="button__edge"></span>
            <span class="button__front">
                Remove ${this.name}  <img class="icon" src="img/trash-x.svg" alt="Trash Can">
            </span>
         </button>`
        const button = template.content.firstChild;

        button.addEventListener("click", this.Delete_Subject_Activities.bind(this));

        BUTTON_CONTAINER.appendChild(button);
    }

    Delete_Subject_Activities(event) {
        // Removes the delete subject button and all activity containers
        event.currentTarget.remove();

        this.activities_list.forEach(activity => {
            activity.remove();
        });

        // Remove reference to this subject
        SUBJECT_CONTROLLER.Deregister_Subject(this);
    }
}
//-----------------------------------------------------------------------------
// Purpose: Activities act as containers for the cards. Normally invisible, but
//          will display as dropzones when a related card is being dragged.
//          Created by the Subject class.
//-----------------------------------------------------------------------------
class Activity extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.addEventListener("dragover", this.Handle_Dragover.bind(this));
        this.addEventListener("drop", this.Handle_Drop.bind(this));
    }

    Initialize(subject, activity_details) {
        // Function called by Subject.
        // Subject data :: Shared across activities with the same subject
        this.subject_id =   subject.id;
        this.subject_name = subject.name;
        this.color =        subject.color;

        // Activity data :: User input from Allocate+
        this.activity_id =  activity_details[0];
        this.day =          activity_details[1];
        this.start_time =   activity_details[2];
        this.spaces =       activity_details[3];
        this.campus =       activity_details[4];
        this.location =     activity_details[5];
        this.duration =     activity_details[6];
        this.weeks =        activity_details[7];
        this.description =  activity_details[8];

        // Derived data :: Required for placement in timetable
        this.row_start = this.Convert_Start_Time_To_Timetable_Row(this.start_time);
        this.row_span = this.Convert_Duration_To_Row_Span(this.duration);
        this.end_time = this.Determine_End_Time_String(this.row_start, this.row_span);

        // Custom Element :: Attributes & Properties
        this.style.setProperty("--_row-start", this.row_start);
        this.style.setProperty("--_row-span", this.row_span);
        this.style.setProperty("--_clr-dropzone", this.color);

        this.setAttribute("class", "activity");
        this.setAttribute("data-subject-id", this.subject_id);
        this.setAttribute("role", "listitem");
    }

    Handle_Dragover(event) {
        // Dragover must be prevented or handled before the drop event can fire
        event.preventDefault();
    }

    Handle_Drop(event) {
        // The drop event does not have a reference to what is being dropped :(

        // Get the card's subject id using the DataTransfer API
        const card_subject_id = event.dataTransfer.getData("text");

        // Guard Statement :: Card and dropzone are not the same subject
        if (card_subject_id != this.subject_id) {
            return;
        }

        // Select the card from the DOM
        const card = document.querySelector(`card-wc[data-subject-id="${card_subject_id}"][drag-in-progress="true"]`);
        
        card.Set_Activity(this);
    }

    Convert_Start_Time_To_Timetable_Row(start_time) {
        const activity_row_start = MAP_TIME_TO_TIMETABLE_ROW.get(start_time);

        // Guard statement :: Activity time not in map
        if (activity_row_start === undefined) {
            console.warn("Activity time string unable to be converted to grid row");
        }

        return activity_row_start;
    }

    Convert_Duration_To_Row_Span(duration) {
        // Parse float will cut off when reading characters
        const hours = parseFloat(duration);
        // Rows are in 30 min segments
        return Math.round(hours * 2);
    }

    Determine_End_Time_String(row_start, row_span) {
        const end_row = row_start + row_span;

        for (const [time, row] of MAP_TIME_TO_TIMETABLE_ROW.entries()) {
            if (row === end_row) {
                return time;
            }
        }

        console.warn("Unable to determine activity end time string");
        return null;
    }
}
//-----------------------------------------------------------------------------
// Purpose: Cards are what the user can see and manipulate. Created by the
//          Subject class.
//-----------------------------------------------------------------------------
class Card extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        // Guard Statement :: The card will be removed and appended multiple times
        // which can cause connectedCallback() to invoke repeatedly
        if (this.connected) {
            return;
        }
        this.connected = true;
        console.log("Card connected");

        this.addEventListener("dragstart", this.Handle_Dragstart.bind(this));
        this.addEventListener("dragend", this.Handle_Dragend.bind(this));
    }

    Initialize(subject) {
        // Function called by Subject.
        // These attributes and properties only need to be set once.
        this.setAttribute("class", "card | flow");
        this.setAttribute("data-subject-id", subject.id);
        this.setAttribute("drag-in-progress", "false");
        this.setAttribute("draggable", "true");
        this.style.setProperty("--_clr-card", subject.color);

        this.Update();
    }

    Render() {
        const {
            subject_name,
            activity_id,
            start_time,
            end_time,
            location,
            spaces
        } = this.activity;
    
        this.innerHTML = `
            <article class="card__article | flow">
                <h4>${subject_name} ${activity_id}</h4>
    
                <p>
                    <time datetime="${start_time}">${start_time}</time> 
                    – 
                    <time datetime="${end_time}">${end_time}</time>
                </p>
    
                <p>${location}</p>
                <p>Spaces: ${spaces}</p>
            </article>
        `;
    }

    Update() {
        // Grab a reference to the parent activity
        this.activity = this.closest(".activity");

        // Guard Statement :: No activity found
        if (this.activity === null || undefined) {
            console.warn("Card could not find activity element");
            return;
        }

        // Render HTML
        this.Render();
    }

    Calculate_Computed_Style() {
        //
    }

    Handle_Dragstart(event) {
        // The activity dropzone needs a subject id to tell if they are the same subject
        event.dataTransfer.setData("text/plain", this.getAttribute("data-subject-id"));
        // Hide native drag image
        event.dataTransfer.setDragImage(INVISIBLE_IMAGE, 0, 0);

        // Offset from cursor
        const rect = this.getBoundingClientRect();
        this.offset_x = event.clientX - rect.left;
        this.offset_y = event.clientY - rect.top;

        // --- WORKAROUND FOR CHROME BUG --- //
        // https://github.com/react-dnd/react-dnd/issues/1085
        //
        // For some reason, changing the styles / attributes of an element during dragstart
        // cancels a drag operation in chromium. Bruh.
        setTimeout(() => {
            // Listen for the card's position over the document
            this.document_dragover_handler = this.Move_Card.bind(this);
            document.addEventListener("dragover", this.document_dragover_handler);

            // Card width is set by the grid parent auto-columns.
            // Card height and padding are percentage based for responsiveness.
            // This introduces a problem when the card is moved to the body...
            // Because percentage is relative to the container.
            // Convert relative percentage values => absolute pixel values.

            this.style.setProperty('--_width', getComputedStyle(this).width);
            this.style.setProperty('--_height', getComputedStyle(this).height);
            this.style.setProperty('--_padding', getComputedStyle(this).paddingLeft);

            // IMPORANT: Must be added after computing the style
            this.setAttribute("drag-in-progress", "true");
        }, 0);
    }

    Handle_Dragend() {
        // --- WORKAROUND FOR CHROME BUG --- //
        setTimeout(() => {
            // If the user drags the card over an invalid dropzone then
            // this.activity will be the Card's previous container.
            this.activity.appendChild(this);

            this.setAttribute("drag-in-progress", "false");

            document.removeEventListener("dragover", this.document_dragover_handler);
    
            this.Reset_Position();
            this.Update();
        }, 0);
    }

    Reset_Position() {
        const card_rect = this.getBoundingClientRect();

        const left = card_rect.left + window.scrollX;
        const top = card_rect.top + window.scrollY;

        this.style.setProperty('--_left', `${left}px`);
        this.style.setProperty('--_top', `${top}px`);
    }

    Move_Card(event) {
        this.style.setProperty('--_left', `${event.clientX - this.offset_x}px`);
        this.style.setProperty('--_top', `${event.clientY - this.offset_y}px`);
    }

    Set_Activity(activity) {
        // Called by Activity
        this.activity = activity;
    }

}
/* ==========================================================================
Runtime
========================================================================== */
// Custom Elements
window.customElements.define('card-wc', Card);
window.customElements.define('activity-wc', Activity);

// Last minute hack
const SUBJECT_CONTROLLER = new Subject_Controller();