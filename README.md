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

# example 1 - get events and
 
When events are returned, a recurring event may generate many
occurrences, so the results from Calender::expandEvents are
array(start, end, page)

```php
// get module
$calendar = wire('modules')->getModule('Calendar');
// get upcoming events - 6 months ahead
$start = new \DateTime();
$until = new \DateTime();
$until->add(new \DateInterval('P6M'));
$events = $calendar->expandEvents($start, $until);
// render event
echo '<table>';
foreach($events as $event) {
    echo '<tr>';
    printf('<td>%s</td>', $event->start->format('Y-m-d H:i'));
    printf('<td>%s</td>', $event->end->format('Y-m-d H:i'));
    printf('<td>%s</td>', $event->event->title);
    echo '</tr>';
}
echo '</table>';
```

# example 2 - ajax event loader

simply do this in your template.

calendar-event.php:
```php
// ajax event request !
if ($config->ajax) {
    // build array to json encode
    $data = array(
        'id'    => $page->id,
        'title' => $page->get('title'),
        'body'  => $page->get('body'),
        'start' => $start->format(DateTime::ISO8601),
        'end'   => $end->format(DateTime::ISO8601),
        'recurs' => $page->calendar_event_rrule != '',
        'linkurl'  => $page->page->url
    );
    // encode and output
    header('Content-type: application/json');
    echo json_encode($data);
    return;
}
// handle normal event display or something
```

# important note

Please note that the template and fields created when installing will not
be removed when the module is uninstalled.

# authors

Tomas Lindquist Olsen  - tomas.l.olsen (at) gmail.com
