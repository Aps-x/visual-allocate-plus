/* ==========================================================================
Constants, Variables, Data, Objects
========================================================================== */
const INPUT_SUBJECT_NAME = document.getElementById("input_subject_name");

const TEXTAREA_ACTIVITY_DETAILS = document.getElementById("textarea_activity_details");

const BUTTON_SUBMIT_USER_INPUT = document.getElementById("button_submit_user_input");

// This could be more elegant but I like the simplicity.
// Start from 2 because the first row is the header row.
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

//-----------------------------------------------------------------------------
// Purpose: The Subject class is responsible for creating and controlling
//          activities. It does not exist in the DOM.
//-----------------------------------------------------------------------------
class Subject {
    static id_counter = 0;

    constructor(subject_name, activity_details) {
        this.id =       Subject.id_counter;
        this.name =     subject_name;
        this.color =    this.Generate_Random_Subject_color();   

        Subject.id_counter++;

        this.Create_Activities(activity_details);
        this.Add_Activities_To_Timetable();
    }

    Create_Activities(activity_details) {
        // For each activity array, create a web component and pass the array data
        this.activities_list = activity_details.map(activity => {
            const activity_wc = document.createElement('activity-wc');
            activity_wc.Initialize(this, activity);
            return activity_wc;
        })
    }

    Add_Activities_To_Timetable() {
        this.activities_list.forEach((activity, index) => {
            // Get the weekday column and append the activity
            const column = document.getElementById(`${activity.day}`);
            const activity_wc = column.appendChild(activity);

            // One card per subject; Create in first activity
            if (index === 0) {
                activity_wc.Create_Card();
            }
        });
    }

    Generate_Random_Subject_color() {
        return `#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}`;
    }

    Create_Delete_Subject_Button() {

    }

    Delete_All_Subject_Activities() {

    }
}
//-----------------------------------------------------------------------------
// Purpose: Activities act as containers for the cards. Normally invisible, but
//          will display as dropzones when a related card is being dragged.
//-----------------------------------------------------------------------------
class Activity extends HTMLElement {
    constructor() {
        super();
        const template = document.getElementById('activity-wc').content;
        this.attachShadow({ mode: 'open' }).appendChild(template.cloneNode(true));
    }

    Initialize(subject, activity_details) {
        // Subject data :: Shared across activities with same subject parent
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

        // Custom Element :: Attributes & Properties
        this.style.setProperty("--_row-start", this.row_start);
        this.style.setProperty("--_row-span", this.row_span);

        this.setAttribute("class", "activity");
        this.setAttribute("data-subject-id", this.subject_id);
        this.setAttribute("data-activity-id", this.activity_id); 
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

    Create_Card() {
        const card = document.createElement('card-wc');
        card.Set_Card_Attributes(this);
        this.appendChild(card);
    }
}
//-----------------------------------------------------------------------------
// Purpose: Cards are what the user can see and manipulate.
//-----------------------------------------------------------------------------
class Card extends HTMLElement {
    
    constructor() {
        super();
        const template = document.getElementById('card-wc').content;
        this.attachShadow({ mode: 'open' }).appendChild(template.cloneNode(true));
    }

    connectedCallback() {
        console.log("Card custom element added to page.");
    }

    Set_Card_Attributes(activity) {
        this.setAttribute("class", "card");
        this.setAttribute("data-subject-id", activity.subject_id);
        this.setAttribute("draggable", "true");

        this.style.setProperty("--_clr-card", activity.color);
    }

}

window.customElements.define('card-wc', Card);
window.customElements.define('activity-wc', Activity);
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

    const activity_details = Process_Activity_Details();

    // Guard statement :: User input is invalid
    if (activity_details.length === 0) {
        return false;
    }
    // More input validation would be nice... too bad!

    new Subject(INPUT_SUBJECT_NAME.value, activity_details);

    Reset_User_Input_Fields();

    event.preventDefault();
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
    //   ["01 Tue 13:30 10 BRUCE Building 7... 2 hrs ... ...],

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

function Reset_User_Input_Fields() {
    INPUT_SUBJECT_NAME.value = "";
    TEXTAREA_ACTIVITY_DETAILS.value = "";
}