/**
 * JS for the CalendarAdmin Process module
 *
 * This will basically set up the fullcalendar functionality
 *
 */

function notify_error(msg) {
    var msg_elem = $('#CalendarAdmin-notification');
    msg_elem.html(msg); // too loose?
    msg_elem.addClass('error');
    msg_elem.show();
    setTimeout(function() {
        msg_elem.fadeOut('fast', function() {
            msg_elem.removeClass('error');
        });
    }, 5000);
}
function notify_success(msg) {
    var msg_elem = $('#CalendarAdmin-notification');
    msg_elem.html(msg); // too loose?
    msg_elem.addClass('success');
    msg_elem.show();
    setTimeout(function() {
        msg_elem.fadeOut('fast', function() {
            msg_elem.removeClass('success');
        });
    }, 5000);
}

//////////////////////////////////////////////////////////////////////////////
// Run: New Event dialog
function CalendarAdminNewEvent(datein) {
    var cal = $('#CalendarAdmin-calendar');
    var dlg = $('#CalendarAdmin-new-event-dialog');

    cal.block({
        message: '<p>Creating event</p>'
    });

    // send the ajax request
    $.ajax({
        url: window.location.href,
        data: {
            newEvent: 1,
            date: moment(datein).format(),
            start: $('#ca-ned-starttime').val(),
            end: $('#ca-ned-endtime').val(),
            title: $('#ca-ned-title').val()
        },
        success: function(data) {
            if (data.error) {
                notify_error('Failed to create event: '+data.message);
            }
            else if (data.id) {
                notify_success('Event created with ID='+data.id);
            }
            //alert('received: '+JSON.stringify(data));
            cal.fullCalendar('refetchEvents');
            //window.location.href = config.urls.admin + 'page/edit/?id=' + data.id;
        },
        error: function(data) {
            alert('failed to create new event');
            cal.fullCalendar('refetchEvents');
        },
        dataType: 'json'
    });
}

//////////////////////////////////////////////////////////////////////////////
// Run: Remove Event dialog
function CalendarAdminRemoveEvent(id) {
    var cal = $('#CalendarAdmin-calendar');

    cal.block({
        message: '<p>Removing event</p>'
    });

    $.ajax({
        url: window.location.href,
        data: {
            deleteEvent: 1,
            eventid: id
        },
        success: function(data) {
            if (data.error) {
                notify_error('Failed to delete event: '+data.message);
            }
            else if (data.success) {
                notify_success('Event deleted');
            }
            //cal.unblock();
            cal.fullCalendar('refetchEvents');
        },
        error: function(data) {
            //cal.unblock();
            cal.fullCalendar('refetchEvents');
        }
    });
}

//function CalendarAdminEditEventDialog()

//////////////////////////////////////////////////////////////////////////////
// Add event exception
function CalendarAddException(event) {
    var cal = $('#CalendarAdmin-calendar');

    cal.block({
        message: '<p>Adding exception</p>'
    });

    $.ajax({
        url: window.location.href,
        data: {
            addExDate: 1,
            eventid: event.id,
            datetime: moment(event.start).format('YYYY-MM-DD HH:mm')
        },
        success: function(data) {
            if (data.error) {
                notify_error('Failed to delete event: '+data.message);
            }
            else if (data.success) {
                notify_success('Event deleted');
            }
            //cal.unblock();
            cal.fullCalendar('refetchEvents');
        },
        error: function(data) {
            //cal.unblock();
            cal.fullCalendar('refetchEvents');
        }
    });
}

//////////////////////////////////////////////////////////////////////////////
// DOM Document ready
$(document).ready(function() {

    // grab the calendar container element on the admin page
    var cal = $('#CalendarAdmin-calendar');
    var tip = $('#CalendarAdmin-tip');
    var loadingbox = $('#CalendarAdmin-loading');

    // set up the fullcalendar
    cal.fullCalendar({
        // just use the admin page itself as ajax backend
        events: window.location.href + '?jsonEvents=1',
        timeFormat: 'H(:mm)',
        firstDay: 1,

        //
        // loading animation
        //
        loading: function(isLoading, view) {
            if (isLoading) {
                console.log('loading ...');
                cal.block({ message: '<p class="CalendarAdmin-loading">Loading events ...</p>'});

            }
            else {
                loadingbox.hide();
                cal.unblock();
            }
        },

        //
        // date clicked
        //
        dayClick: function(date, jev, view) {
            var d = moment(date).format('YYYY-MM-DD');
            var t = moment(date).format('HH:mm');

            //console.log(d);
            //console.log('Hello World');

            var dlg = $('#CalendarAdmin-new-event-dialog');
            dlg.find('.ca-ned-date').html('Date: '+d);

            dlg.dialog({
                modal: true,
                draggable: false,
                title: 'New event',

                buttons: [
                    {
                        text: 'OK',
                        click: function() {
                            CalendarAdminNewEvent(date);
                            dlg.dialog('close');
                        }
                    },
                    {
                        text: 'Cancel',
                        click: function(){
                            dlg.dialog('close');
                        }
                    }
                ]
            });
        },

        //
        // event clicked
        //
        eventClick: function(event, jev, view) {
            if (event.recurrence) {
                var dialog = $('#CalendarAdmin-edit-event-dialog').dialog({
                    modal: 1,
                    draggable: false,
                    title: 'Edit event',
                    buttons: [
                        {
                            text: 'Modify this event occurrence only',
                            disabled: true,
                            click: function() {
                                // 1) add recurrence exception
                                // 2) copy event to non-recurring event on same start/end date
                                // 3) edit that event
                                alert('Creating modified occurrence is not yet implemented');
                            }
                        },
                        {
                            text: 'Modify all occurrences of this event',
                            click: function() {
                                // modify event
                                window.location.href = config.urls.admin + 'page/edit/?id=' + event.id;
                            }
                        },
                        {
                            text: 'Remove only this event occurrence',
                            click: function() {
                                // add recurrence exception
                                CalendarAddException(event);
                                dialog.dialog('close');
                            }
                        },
                        {
                            text: 'Remove all occurrences of this event',
                            click: function() {
                                // remove event
                                // well, confirm it one more time just in case
                                if (confirm('Are you sure you want to delete the event?')) {
                                    CalendarAdminRemoveEvent(event.id);
                                    dialog.dialog('close');
                                }
                            }
                        }

                    ]
                });
            }
            else {
                var dialog = $('#CalendarAdmin-edit-event-dialog').dialog({
                    modal: 1,
                    draggable: false,
                    title: 'Edit event',
                    buttons: [
                        {
                            text: 'Modify event',
                            click: function() {
                                // modify event
                                window.location.href = config.urls.admin + 'page/edit/?id=' + event.id;
                                dialog.dialog('close');
                            }
                        },
                        {
                            text: 'Remove event',
                            click: function() {
                                // remove event
                                // well, confirm it one more time just in case
                                if (confirm('Are you sure you want to delete the event? This cannot be undone.')) {
                                    CalendarAdminRemoveEvent(event.id);
                                }
                                dialog.dialog('close');
                            }
                        }

                    ]
                });
            }
        },

        //
        // event mouseover
        //
        eventMouseover: function(event, jev, view) {
            var b = jev.currentTarget.getBoundingClientRect();
            tip.css({
                left: b.left,//jev.clientX,
                top: b.bottom
            });
            var ed = moment(event.start).format('YYYY-MM-DD HH:mm');
            ed += moment(event.end).format(' - HH:mm');
            tip.find('.date').html(ed);
            tip.find('.title').html(event.title);
            tip.show();
        },

        //
        // event mouseout
        //
        eventMouseout: function(event, jev, view) {
            tip.hide();
        }

    });

    // debugging field
    var d = $('#CalendarAdmin-debug');
}); 
