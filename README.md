# Visual Allocate+

[Website Link](https://aps-x.github.io/visual-allocate-plus/index.html)

Visual Allocate+ is a drag-and-drop timetable planner to help students plan their timetable in a more intuitive way in comparison to Allocate+'s table formatting. Students have to manually copy/paste Allocate+ information into the website, which is more tedious than scraping the info from UC, however this also allows students from ANY university to use this website, and I believe this is worthwhile.

This website is made using web components and vanilla Javascript. I am not a luddite, rather I was given the advice that I should understand the fundamentals of the web before diving into frameworks, because frameworks may have breaking updates or fall out of fashion, but the foundations they were built on won’t change.

Web components are just OK; I found the shadow DOM to not be worth the hassle. It was still an excellent way of having an object with methods and properties exist in the DOM.

I am relying on grid-auto-columns for the layout algorithm for the cards. I have seen others accomplish this layout by determining overlap groups and then setting the width of cards that way. However, I haven’t seen an example of cards being efficiently ‘packed’. There is a surprising amount of depth to laying out cards this way. When masonry / item-flow enters the CSS specifications, I might try adding it in as a progressive enhancement if it allows me to disable columns and allow cards to horizontally flex-grow.

I am honestly proud of this code and I think it demonstrates my understanding of Javascript, CSS, as well as HTML and the DOM.
