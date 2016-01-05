<?php

namespace SubwayBuddy\UserBundle\Services;

class SNCFAPI {
     const SNCF_ID = "64a2bb12-fb79-45e2-b1bf-dbcb259c5829";
     const SNCF_PASSWORD = " ";
     const SNCF_URL = "https://api.sncf.com/v1/coverage/sncf/commercial_modes";

    public function testAction(){
        $username= self::SNCF_ID;
        $password= self::SNCF_PASSWORD;
        $URL= self::SNCF_URL;

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL,$URL);
        curl_setopt($ch, CURLOPT_TIMEOUT, 30); //timeout after 30 seconds
        curl_setopt($ch, CURLOPT_RETURNTRANSFER,1);
        curl_setopt($ch, CURLOPT_HTTPAUTH, CURLAUTH_ANY);
        curl_setopt($ch, CURLOPT_USERPWD, "$username:$password");
        $result=curl_exec ($ch);
        curl_close ($ch);
        var_dump($result);exit;
        return json_decode($result);
    }
}