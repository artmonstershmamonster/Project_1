<?php

if ( trim($_POST['email']) && trim($_POST['name']) && trim($_POST['gr_ct']) ) {

$fields = array(
	'name' => trim($_POST['name']),//trim($_POST['name']),//'Ирина',
	'phone' => trim($_POST['phone']) ? trim($_POST['phone']) : '0',//trim($_POST['phone']),//'+380999999999',
	'email' => trim($_POST['email']),//trim($_POST['email']),//'orishka812@ukr.net',
	'gr_ct' => trim($_POST['gr_ct']),//trim($_POST['gr_ct']),//'Lead Name',
	'l_u_s' => trim($_POST['l_u_s']) ? trim($_POST['l_u_s']) : 'noUtm', //trim($_POST['l_u_s']) ? trim($_POST['l_u_s']) : 'errl_u_s',//'fb',
);


require_once( 'GetResponseAPI3.class.php' );

$getresponse = new GetResponse('32012af1128f3d015ed792c5be42b5e3');


$arrContact = array(
	'query' => array(
		'email' => $fields['email'],
	),
	'fields' => 'email'
);



$contact = $getresponse->getContacts($arrContact);
$contact = json_decode(json_encode($contact), True);



if ($contact) {
	//echo "FIND CONTACT";

	$company = array();
	/*
	foreach ($contact as $value) {	
		$response = $getresponse->getContact($value['contactId']);
		$response = json_decode(json_encode($response), True);	

		array_push($company, $response['campaign']['campaignId']);
	}
	*/

	//$find_company = in_array($fields['gr_ct'], $company);


	//if ($find_company) {
	//	$err = json_encode(array('error' => '9999'));
	//	var_dump($company);
	//} else {

		$customFieldValues = array(
		    array('customFieldId' => 'aF5eh',
		        'value' => array(
		            $fields['phone']
		        )
		    ),
		    array('customFieldId' => 'o5niW',
		        'value' => array(
		            $fields['l_u_s']
		    	)
		    ),
		);

		$arr_new_contact = array(
			'name' => $fields['name'],
			'email' => $fields['email'],
			'dayOfCycle' => 0,
			'campaign' => array('campaignId' => $fields['gr_ct']),
			'customFieldValues' => $customFieldValues,
		);

		$responce = $getresponse->updateContact($value['contactId'], $arr_new_contact);//updateContact $value['contactId']
		$responce = json_decode(json_encode($responce), True);

		//var_dump($responce);

		if ($responce && $responce['code'] && $responce['message']) {

			echo json_encode(array('code' => $responce['code'], 'message' => $responce['message'] ));

		} else {

			echo json_encode( array( 'gr_id' => 'update ok' ) );

		}
		
		//$gr_id = $value['contactId'];
		//echo json_encode($gr_id);
		//echo json_encode(array('u_id' => $crm_id, 'l_id' =>  $new_leads_id_resp ));
	//}

} else {
	//echo "NO FIND CONTACT";
	$customFieldValues = array(
	    array('customFieldId' => 'aF5eh',
	        'value' => array(
	            $fields['phone']
	        )
	    ),
	    array('customFieldId' => 'o5niW',
	        'value' => array(
	            $fields['l_u_s']
	    	)
	    ),
	);
	$arr_new_contact = array(
		'name' => $fields['name'],
		'email' => $fields['email'],
		'dayOfCycle' => 0,
		'campaign' => array('campaignId' => $fields['gr_ct']),
		'customFieldValues' => $customFieldValues,
	);

	$responce = $getresponse->addContact($arr_new_contact);
	$responce = json_decode(json_encode($responce), True);

	$get_contact_id = $getresponse->getContacts($arrContact);
	$get_contact_id = json_decode(json_encode($get_contact_id), True);

	if ($responce && $responce['code'] && $responce['message']) {

		echo json_encode(array('code' => $responce['code'], 'message' => $responce['message'] ));

	} else {

		echo json_encode( array( 'gr_id' => 'add ok' ) );

	}



	


	//echo json_encode(array('lgb_gr_user_id' => $get_contact_id[0]['contactId']));
	//$gr_id = $get_contact_id[0]['contactId'];
	//echo "<pre>";
	//var_dump($responce);
	//var_dump($get_contact_id[0]['contactId']);
	//echo json_encode($gr_id);
	}

}
