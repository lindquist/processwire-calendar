<?php

class CalendarConfig extends ModuleConfig {
    public function __construct() {
        $this->add(array(
            array(
                'name' => 'calendar_root_page',
                'label' => 'Calendar Root Page',
                'type' => 'PageListSelect',
                'required' => true,
                'value' => '',
            ),
        ));
    }
}
