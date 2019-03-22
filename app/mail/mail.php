<?php

if ( trim($_POST['email']) && trim($_POST['name']) ) {


    //$new_leads_id_resp = 

    require_once 'amocrm.phar';

    $new_lead_tags_name = trim($_POST['l_btn']);
    $new_lead_btn = trim($_POST['l_btn']) ? trim($_POST['l_btn']) : '0';
    $new_lead_form = trim($_POST['l_form']) ? trim($_POST['l_form']) : '0';
    $new_lead_name = trim($_POST['l_name']) ? trim($_POST['l_name']) : false;
    if (!$new_lead_name) {
        $new_lead_name = trim($_POST['l_info']) ? trim($_POST['l_info']) : 'Заявка';
    }
    $new_lead_location = trim($_POST['l_loc']) ? trim($_POST['l_loc']) : '0';


    $utm_source = trim($_POST['l_u_s']);
    $utm_campaign = trim($_POST['l_u_c']);
    $utm_medium = trim($_POST['l_u_m']);
    $utm_content = trim($_POST['l_u_co']);
    $utm_term = trim($_POST['l_u_t']);

    $visitor_uid = trim($_POST['l_v']);
    $new_lead_price = trim($_POST['l_pr']) ? trim($_POST['l_pr']) : 0;
    $new_lead_status = trim($_POST['l_st']) ? trim($_POST['l_st']) : 142;
    $new_lead_info = trim($_POST['l_info']) ? trim($_POST['l_info']) : 'error';

    $user_name = trim($_POST['name']);
    $user_phone = trim($_POST['phone']);
    $user_email = trim($_POST['email']);


    try {
        // Создание клиента
        $amo = new \AmoCRM\Client('karla', 'alexrreva@gmail.com', 'eb3cd51b2f0edc1aa39fa7feeea4c865');

        $lead = $amo->lead;
        $lead['name'] = $new_lead_name;
        //$lead['date_create'] = time();
        //$lead['pipeline_id'] = 1357681;
        $lead['status_id'] = $new_lead_status;
        $lead['price'] = (int)$new_lead_price;
        $lead['visitor_uid'] = $visitor_uid;
        //$lead['responsible_user_id'] = 0;
        $lead['tags'] = $new_lead_tags_name;
        $lead->addCustomField(460415, $utm_source);
        $lead->addCustomField(460417, $utm_campaign);
        $lead->addCustomField(460419, $utm_medium);
        $lead->addCustomField(460421, $utm_content);
        $lead->addCustomField(460423, $utm_term);

        $lead->addCustomField(460425, $new_lead_btn);
        $lead->addCustomField(460427, $new_lead_form);
        $lead->addCustomField(460429, $new_lead_location);
        $lead->addCustomField(460431, $new_lead_info);

        $new_leads_id_resp = $lead->apiAdd();

        //$req = $amo->contact->apiList(['query' => $user_email]);

        sleep(1);

        $contact = $amo->contact;
        //$contact->debug(true); // Режим отладки
        $contact['name'] = $user_name;
        //$contact['request_id'] = $user_id;
        $contact['date_create'] = time();
        $contact['responsible_user_id'] = 0;
        //$contact['company_name'] = 'ООО Тестовая компания';
        //$contact['tags'] = $new_lead_tags_name;
        $contact['linked_leads_id'] = $new_leads_id_resp;
        $contact->addCustomField(266644, [
            [$user_phone, 'WORK'],
        ]);
        $contact->addCustomField(266646, [
            [$user_email, 'WORK'],
        ]);
        // ---------- UTM -------------------



        $crm_id = $contact->apiAdd();
        //$crm_id = $crm_id['id'];
        echo json_encode(array('u_id' => $crm_id, 'l_id' =>  $new_leads_id_resp ));


    } catch (\AmoCRM\Exception $e) {
        printf('Error (%d): %s' . PHP_EOL, $e->getCode(), $e->getMessage());

        $err = $e->getCode(). ' : ' .$e->getMessage();
    }

}

?>