<?php


if ( trim($_POST['phone']) || trim($_POST['l_id']) ) {

    

    require_once 'amocrm.phar';

    $user_id = trim($_POST['u_id']);
    $lead_id = trim($_POST['l_id']);
    $user_phone = trim($_POST['phone']);
    $new_lead_status = trim($_POST['l_st']) ? trim($_POST['l_st']) : 142;


    try {
        // Создание клиента
        $amo = new \AmoCRM\Client('karla', 'alexrreva@gmail.com', 'eb3cd51b2f0edc1aa39fa7feeea4c865');
        

        if ($lead_id) {
            //$date = new DateTime();
            $lead = $amo->lead;
            $lead['status_id'] = $new_lead_status;
            //$new_leads_id_resp = $lead->apiAdd();

            $res = $lead->apiUpdate((int)$lead_id, 'now');
        }
        
        if ( trim($_POST['phone']) ) {

            // Обновление контактов
            $contact = $amo->contact;
            //$lead['status_id'] = '21847858';
            $contact['updated_at'] = time();
            $contact->addCustomField(266644, [
                [$user_phone, 'WORK'],
            ]);
            $result = $contact->apiUpdate((int)$user_id, 'now');

            //$crm_id = $crm_id['id'];

        }

        echo json_encode($res);


    } catch (\AmoCRM\Exception $e) {
        printf('Error (%d): %s' . PHP_EOL, $e->getCode(), $e->getMessage());

        $err = $e->getCode(). ' : ' .$e->getMessage();
    }

}

?>
