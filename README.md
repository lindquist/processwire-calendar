# processwire-calendar

Proof-of-concept alpha of a calendar for ProcessWire

The Calendar module creates a template for events as well as the four fields
that the it expects in event pages.

- event start date/time
- event end date/time
- event RRULE recurrence specification
- event EXDATE recurrence exceptions

Recurring events are handled using the fruux/sabre-vobject library.

RFC 5545 RRULE and EXDATE are supported to the extent supported in the
sabre-vobject library.
 
The ProcessCalendarAdmin module creates an admin page that uses fullcalendar
present a more user friendly interface for managing events.

# usage

- Install the Calendar module
- Create parent page to hold events
- Configure the Calendar module to the right event "container"
- Set up templates

Then

- Install ProcessCalendarAdmin for calendar admin gui.

# important note

Please note that the template and fields created when installing will not
be removed when the module is uninstalled.

# authors

Tomas Lindquist Olsen  - tomas.l.olsen (at) gmail.com
