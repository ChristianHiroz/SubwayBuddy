<?php

namespace SubwayBuddy\UserBundle\Controller;

use Doctrine\Common\Collections\ArrayCollection;
use DoctrineExtensions\Tests\Entities\Date;
use FOS\RestBundle\Controller\Annotations\Delete;
use FOS\RestBundle\Controller\Annotations\Get;
use FOS\RestBundle\Controller\Annotations\Post;
use FOS\RestBundle\Controller\Annotations\Put;
use FOS\RestBundle\Controller\Annotations\RequestParam;
use FOS\RestBundle\Request\ParamFetcher;
use FOS\RestBundle\Controller\FOSRestController;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use SubwayBuddy\UserBundle\Entity\Chatroom;
use SubwayBuddy\UserBundle\Entity\Message;
use SubwayBuddy\UserBundle\Entity\Subject;
use SubwayBuddy\UserBundle\Entity\Travel;
use SubwayBuddy\UserBundle\Entity\User as User;
use FOS\RestBundle\Controller\Annotations\View;
use FOS\RestBundle\View\View as Vieww;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Symfony\Bundle\FrameworkBundle\Templating\TemplateReference;
use Symfony\Component\Config\Definition\Exception\Exception;
use Symfony\Component\Validator\Constraints\DateTime;

class APIController extends FOSRestController
{
    //<editor-fold desc="Travel">
    /**
     * Create Travel
     *
     * @param ParamFetcher $paramFetcher Paramfetcher
     *
     * @RequestParam(name="name", nullable=false, strict=true, description="Travel name.")
     * @RequestParam(name="time", nullable=false, strict=true, description="Travel date.")
     * @RequestParam(name="user", nullable=false, strict=true, description="User id.")
     * @Post
     * @View()
     *
     * @return View
     */
    public function postTravelAction(ParamFetcher $paramFetcher)
    {

        $name = $paramFetcher->get('name');
        $time = $paramFetcher->get('time');
        $user = $paramFetcher->get('user');

        $em = $this->getDoctrine()->getManager();

        $user =  $em->getRepository('SubwayBuddyUserBundle:User')->find($user);


        $travel = new Travel();
        $travel->setName($name);

        $time = new \DateTime($time);
        $travel->setTime($time);
        $travel->setUser($user);
        $user->addTravel($travel);

        $em->persist($travel);
        $em->flush();

        $view = Vieww::create();
        $view->setData($travel)->setStatusCode(200);

        return $view;
    }

    /**
     * @return array
     * @View()
     */
    public function getTravelsAction()
    {

        $em = $this->getDoctrine()->getManager();
        $entity  =  $em->getRepository('SubwayBuddyUserBundle:Travel')->findAll();
        if (!$entity) {
            throw $this->createNotFoundException('Data not found.');
        }
        $view = Vieww::create();
        $view->setData($entity)->setStatusCode(200);
        return $view;
    }

    /**
     * @param Travel $travel
     * @return array
     * @View()
     * @ParamConverter("travel", class="SubwayBuddyUserBundle:Travel")
     */
    public function getTravelAction(Travel $travel)
    {
        return array('travel' => $travel);
    }

    /**
     * @param Travel $travel
     * @return array
     * @View()
     * @ParamConverter("user", class="SubwayBuddyUserBundle:User")
     */
    public function getUserTravelAction(User $user)
    {
        $em = $this->getDoctrine()->getManager();
        $entity  =  $em->getRepository('SubwayBuddyUserBundle:Travel')->findBy(array('user' => $user));
        if (!$entity) {
            throw $this->createNotFoundException('Data not found.');
        }
        $view = Vieww::create();
        $view->setData($entity)->setStatusCode(200);
        return $view;
    }

    /**
     * Update a Travel from the submitted data.<br/>
     *
     * @param ParamFetcher $paramFetcher Paramfetcher
     *
     * @RequestParam(name="name", nullable=false, strict=true, description="Travel name.")
     * @RequestParam(name="time", nullable=false, strict=true, description="Travel date.")
     * @RequestParam(name="user", nullable=false, strict=true, description="User id.")
     * @RequestParam(name="travel", nullable=false, strict=true, description="Travel id.")
     * @Put
     *
     * @return View
     */
    public function putTravelsAction(ParamFetcher $paramFetcher)
    {
        $name = $paramFetcher->get('name');
        $time = $paramFetcher->get('time');
        $user = $paramFetcher->get('user');
        $travel = $paramFetcher->get('travel');

        $user  =  $this->getDoctrine()->getEntityManager()->getRepository('SubwayBuddyUserBundle:User')->find($user);
        $travel  =  $this->getDoctrine()->getEntityManager()->getRepository('SubwayBuddyUserBundle:Travel')->find($travel);

        $time = new \DateTime($time);
        $travel->setUser($user);
        $travel->setName($name);
        $travel->setTime($time);
        $user->addTravel($travel);

        $em = $this->getDoctrine()->getManager();
        $em->persist($travel);
        $em->flush();

        $view = Vieww::create();
        $view->setData($travel)->setStatusCode(200);

        return $view;
    }

    /**
     * @return array
     * @View()
     * @ParamConverter("travel", class="SubwayBuddyUserBundle:Travel")
     */
    public function deleteTravelsAction(Travel $travel){
        $em = $this->getDoctrine()->getManager();
        $entity  =  $em->getRepository('SubwayBuddyUserBundle:Travel')->find($travel);

        $em->remove($entity);
        $em->flush();

        $message = "Travel deleted !";

        $view = Vieww::create();
        $view->setData($message)->setStatusCode(200);

        return $view;

    }

    //</editor-fold>

    //<editor-fold desc="Subject">
    /**
     * Create Subject
     *
     * @param ParamFetcher $paramFetcher Paramfetcher
     *
     * @RequestParam(name="subject", nullable=false, strict=true, description="Subject to discuss.")
     * @RequestParam(name="number", nullable=false, strict=true, description="Priority for the subject.")
     * @RequestParam(name="user", nullable=false, strict=true, description="User id.")
     * @Post
     * @View()
     *
     * @return View
     */
    public function postSubjectAction(ParamFetcher $paramFetcher)
    {

        $subjectP = $paramFetcher->get('subject');
        $number = $paramFetcher->get('number');
        $user = $paramFetcher->get('user');

        $em = $this->getDoctrine()->getManager();

        try{
            $user =  $em->getRepository('SubwayBuddyUserBundle:User')->find($user);
        }
        catch(Exception $e){

        }


        $subject = new Subject();
        $subject->setNumber($number);
        $subject->setSubject($subjectP);
        $subject->setUser($user);

        $user->addSubject($subject);

        $em->persist($subject);
        $em->flush();

        $view = Vieww::create();

        $view->setData($subject)->setStatusCode(200);

        return $view;
    }

    /**
     * @return array
     * @View()
     */
    public function getSubjectsAction()
    {

        $em = $this->getDoctrine()->getManager();
        $entity  =  $em->getRepository('SubwayBuddyUserBundle:Subject')->findAll();
        if (!$entity) {
            throw $this->createNotFoundException('Data not found.');
        }
        $view = Vieww::create();
        $view->setData($entity)->setStatusCode(200);
        return $view;
    }

    /**
     * @param Subject $subject
     * @return array
     * @View()
     * @ParamConverter("subject", class="SubwayBuddyUserBundle:Subject")
     */
    public function getSubjectAction(Subject $subject)
    {
        return array('subject' => $subject);
    }

    /**
     * @param Subject $subject
     * @return array
     * @View()
     * @ParamConverter("user", class="SubwayBuddyUserBundle:User")
     */
    public function getUserSubjectAction(User $user)
    {
        $em = $this->getDoctrine()->getManager();
        $entity  =  $em->getRepository('SubwayBuddyUserBundle:Subject')->findBy(array('user' => $user));
        if (!$entity) {
            throw $this->createNotFoundException('Data not found.');
        }
        $view = Vieww::create();
        $view->setData($entity)->setStatusCode(200);
        return $view;
    }

    /**
     * Create a User from the submitted data.<br/>
     *
     * @param ParamFetcher $paramFetcher Paramfetcher
     * @RequestParam(name="subjectName", nullable=false, strict=true, description="Subject.")
     * @RequestParam(name="number", nullable=false, strict=true, description="Subject's priority.")
     * @RequestParam(name="user", nullable=false, strict=true, description="User id.")
     * @RequestParam(name="subject", nullable=false, strict=true, description="Subject id.")
     * @Put
     *
     * @return View
     */
    public function putSubjectsAction(ParamFetcher $paramFetcher)
    {
        $subjectStr = $paramFetcher->get('subjectName');
        $number = $paramFetcher->get('number');
        $subject = $paramFetcher->get('subject');
        $user = $paramFetcher->get('user');

        $user  =  $this->getDoctrine()->getEntityManager()->getRepository('SubwayBuddyUserBundle:User')->find($user);

        $subject  =  $this->getDoctrine()->getEntityManager()->getRepository('SubwayBuddyUserBundle:Subject')->find($subject);

        $subject->setSubject($subjectStr);
        $subject->setNumber($number);
        $subject->setUser($user);
        $user->addSubject($subject);

        $em = $this->getDoctrine()->getManager();
        $em->persist($user);
        $em->flush();

        $view = Vieww::create();
        $view->setData($subject)->setStatusCode(200);

        return $view;
    }

    /**
     * @return array
     * @View()
     */
    public function deleteSubjectsAction(Subject $subject){
        $em = $this->getDoctrine()->getManager();
        $entity  =  $em->getRepository('SubwayBuddyUserBundle:Subject')->find($subject);

        $em->remove($entity);
        $em->flush();

        $message = "Subject deleted !";

        $view = Vieww::create();
        $view->setData($message)->setStatusCode(200);

        return $view;

    }
    //</editor-fold>

    //<editor-fold desc="User">
    /**
     * Create a User from the submitted data.<br/>
     *
     * @param ParamFetcher $paramFetcher Paramfetcher
     *
     * @RequestParam(name="username", nullable=false, strict=true, description="Username.")
     * @RequestParam(name="email", nullable=false, strict=true, description="Email.")
     * @RequestParam(name="password", nullable=false, strict=true, description="Plain Password.")
     * @Post
     *
     * @return View
     */
     public function postUsersAction(ParamFetcher $paramFetcher)
    {
        $userManager = $this->container->get('fos_user.user_manager');
        $user = $userManager->createUser();
        $user->setUsername($paramFetcher->get('username'));
        $user->setEmail($paramFetcher->get('email'));
        $user->setPlainPassword($paramFetcher->get('password'));
        $user->setEnabled(true);
        $user->addRole('ROLE_API');
        $view = Vieww::create();
        $errors = $this->get('validator')->validate($user, array('Registration'));
        if (count($errors) == 0) {
            $userManager->updateUser($user);
            $view->setData($user)->setStatusCode(200);
            return $view;
        } else {
            $message= "An error occured while creating the user";
            $view->setData($message)->setStatusCode(500);
            return $view;
        }
    }

    /**
     * Update a User from the submitted data.<br/>
     *
     * @param ParamFetcher $paramFetcher Paramfetcher
     *
     * @RequestParam(name="username", nullable=false, strict=true, description="Username.")
     * @RequestParam(name="email", nullable=false, strict=true, description="Email.")
     * @RequestParam(name="password", nullable=false, strict=true, description="Plain Password.")
     * @RequestParam(name="user", nullable=false, strict=true, description="User id.")
     * @Put
     *
     * @return View
     */
    public function putUsersAction(ParamFetcher $paramFetcher)
    {
        $id = $paramFetcher->get('user');
        $userManager = $this->container->get('fos_user.user_manager');
        $user  =  $this->getDoctrine()->getEntityManager()->getRepository('SubwayBuddyUserBundle:User')->find($id);
        $user->setUsername($paramFetcher->get('username'));
        $user->setEmail($paramFetcher->get('email'));
        $user->setPlainPassword($paramFetcher->get('password'));
        $user->setEnabled(true);
        $user->addRole('ROLE_API');
        $view = Vieww::create();
        $errors = $this->get('validator')->validate($user, array('Registration'));
        if (count($errors) == 0) {
            $userManager->updateUser($user);
            $view->setData($user)->setStatusCode(200);
            return $view;
        } else {
            $message= "An error occured while updating the user";
            $view->setData($message)->setStatusCode(500);
            return $view;
        }
    }

    /**
     * Login a User from the submitted data.<br/>
     *
     * @param ParamFetcher $paramFetcher Paramfetcher
     *
     * @RequestParam(name="username", nullable=false, strict=true, description="Username.")
     * @RequestParam(name="password", nullable=false, strict=true, description="Plain Password.")
     * @Post
     *
     * @return View
     */
    public function loginUserAction(ParamFetcher $paramFetcher)
    {

        $username = $paramFetcher->get('username');
        $password = $paramFetcher->get('password');

        return $this->container->get('subwaybuddy_user.user_service')->login($username, $password);
    }
    //</editor-fold>

    ////<editor-fold desc="Chat">
    /**
     * Create ChatRoom
     *
     * @param ParamFetcher $paramFetcher Paramfetcher
     *
     * @RequestParam(name="name", nullable=false, strict=true, description="Chatroom name.")
     * @RequestParam(name="description", nullable=false, strict=true, description="Chatroom description.")
     * @RequestParam(name="user1", nullable=false, strict=true, description="User 1 id.")
     * @RequestParam(name="user2", nullable=false, strict=true, description="User 2 id.")
     * @Post
     * @View()
     *
     * @return View
     */
    public function postChatroomAction(ParamFetcher $paramFetcher)
    {

        $name = $paramFetcher->get('name');
        $description = $paramFetcher->get('description');
        $user1 = $paramFetcher->get('user1');
        $user2 = $paramFetcher->get('user2');

        $em = $this->getDoctrine()->getManager();

        $user1 =  $em->getRepository('SubwayBuddyUserBundle:User')->find($user1);
        $user2 =  $em->getRepository('SubwayBuddyUserBundle:User')->find($user2);

        $chatroom = new Chatroom();
        $chatroom->addUser($user1);
        $chatroom->addUser($user2);
        $user1->addChatroom($chatroom);
        $user2->addChatroom($chatroom);
        $chatroom->setName($name);
        $chatroom->setDescription($description);

        $em->persist($chatroom);
        $em->flush();

        $view = Vieww::create();
        $view->setData($chatroom)->setStatusCode(200);

        return $view;
    }

    /**
     * @return array
     * @View()
     */
    public function getChatroomsAction()
    {
        $em = $this->getDoctrine()->getManager();
        $entitys  =  $em->getRepository('SubwayBuddyUserBundle:Chatroom')->findAll();
        if (!$entitys) {
            throw $this->createNotFoundException('Data not found.');
        }
        $view = Vieww::create();
        $view->setData($entitys)->setStatusCode(200);
        return $view;
    }

        /**
     * @param Travel $travel
     * @return array
     * @View()
     * @ParamConverter("chatroom", class="SubwayBuddyUserBundle:Chatroom")
     */
    public function getChatroomAction(Chatroom $chatroom)
    {
        return array('chatroom' => $chatroom);
    }

    /**
     * @param User $user
     * @return array
     * @View()
     * @ParamConverter("user", class="SubwayBuddyUserBundle:User")
     */
    public function getUserChatroomsAction(User $user)
    {
        $entitys  =  $user->getChatrooms();
        if (!$entitys) {
            throw $this->createNotFoundException('Data not found.');
        }
        $view = Vieww::create();
        $view->setData($entitys)->setStatusCode(200);
        return $view;
    }

    /**
     * Create Message
     *
     * @param ParamFetcher $paramFetcher Paramfetcher
     *
     * @RequestParam(name="texte", nullable=false, strict=true, description="Message text.")
     * @RequestParam(name="user", nullable=false, strict=true, description="Message user.")
     * @RequestParam(name="chatroom", nullable=false, strict=true, description="Message chatroom.")
     * @Post
     * @View()
     *
     * @return View
     */
    public function postMessageAction(ParamFetcher $paramFetcher)
    {
        $em = $this->getDoctrine()->getManager();

        $texte = $paramFetcher->get('texte');
        $user = $paramFetcher->get('user');
        $chatroom = $paramFetcher->get('chatroom');

        $user = $em->getRepository('SubwayBuddyUserBundle:User')->find($user);
        $chatroom = $em->getRepository('SubwayBuddyUserBundle:Chatroom')->find($chatroom);

        $message = new Message();

        $message->setTexte($texte);
        $message->setUser($user);
        $message->setChatroom($chatroom);
        $chatroom->addMessage($message);

        $em->persist($message);
        $em->flush();

        $view = Vieww::create();
        $view->setData($message)->setStatusCode(200);

        return $view;
    }
//</editor-fold>

    //<editor-fold desc="Buddy matching">
    /**
     * @param Travel $travel
     * @return array
     * @View()
     * @ParamConverter("travel", class="SubwayBuddyUserBundle:Travel")
     */
    public function getMatchingByTravelAction(Travel $travel)
    {
        $em = $this->getDoctrine()->getManager();
        $matchedUsersArray  =  $em->getRepository('SubwayBuddyUserBundle:Travel')->match($travel);
        if (!$matchedUsersArray) {
            throw $this->createNotFoundException('Aucuns matchs.');
        }
        $matchedUsers = new ArrayCollection();
        foreach($matchedUsersArray as $matchedUser){
            $matchedUsers[] = $em->getRepository('SubwayBuddyUserBundle:User')->find($matchedUser[1]);
        }

        $view = Vieww::create();
        $view->setData($matchedUsers)->setStatusCode(200);

        return $view;
    }

    /**
     * @param Subject $subject
     * @return array
     * @View()
     * @ParamConverter("subject", class="SubwayBuddyUserBundle:Subject")
     */
    public function getMatchingBySubjectAction(Subject $subject)
    {
        $em = $this->getDoctrine()->getManager();
        $matchedUsersArray  =  $em->getRepository('SubwayBuddyUserBundle:Subject')->match($subject);
        if (!$matchedUsersArray) {
            throw $this->createNotFoundException('Aucuns matchs.');
        }
        $matchedUsers = new ArrayCollection();
        foreach($matchedUsersArray as $matchedUser){
            $matchedUsers[] = $em->getRepository('SubwayBuddyUserBundle:User')->find($matchedUser[1]);
        }

        $view = Vieww::create();
        $view->setData($matchedUsers)->setStatusCode(200);

        return $view;
    }

    /**
     * @param Travel $travel
     * @return array
     * @View()
     * @ParamConverter("travel", class="SubwayBuddyUserBundle:Travel")
     */
    public function getMatchingAction(Travel $travel)
    {
        $em = $this->getDoctrine()->getManager();
        $matchedUsersArray  =  $em->getRepository('SubwayBuddyUserBundle:User')->match($travel);
        if (!$matchedUsersArray) {
            throw $this->createNotFoundException('Aucuns matchs.');
        }
        $matchedUsers = new ArrayCollection() ;
        foreach($matchedUsersArray as $matchedUser){
            $user           = $em->getRepository('SubwayBuddyUserBundle:User')->find($matchedUser[1]);
            $subjects       = $em->getRepository('SubwayBuddyUserBundle:Subject')->findBy(array('user' => $matchedUser[1]));
            // quickfix : on supprime les sujet des subjects
            foreach( $subjects AS &$subject )
            {
                $subject->setUser( new ArrayCollection() ) ; 
            }
            $matchedUsers->add(array(
                "id"    => $user->getId(),
                "name"  => $user->getUsername(),
                "subjects"  => $subjects
            ));
        }

        $view = Vieww::create();
        $view->setData($matchedUsers)->setStatusCode(200);

        return $view;
    }

    /**
     * Update a User to add a friend data.<br/>
     *
     * @param ParamFetcher $paramFetcher Paramfetcher
     *
     * @RequestParam(name="user", nullable=false, strict=true, description="User id.")
     * @RequestParam(name="buddy", nullable=false, strict=true, description="User buddy id.")
     * @Put
     *
     * @return View
     */
    public function putBuddyAction(ParamFetcher $paramFetcher)
    {
        $id = $paramFetcher->get('user');
        $idBuddy = $paramFetcher->get('buddy');
        $userManager = $this->container->get('fos_user.user_manager');
        $user  =  $this->getDoctrine()->getEntityManager()->getRepository('SubwayBuddyUserBundle:User')->find($id);
        $buddy  =  $this->getDoctrine()->getEntityManager()->getRepository('SubwayBuddyUserBundle:User')->find($idBuddy);
        $user->addBuddy($buddy);
        $view = Vieww::create();
        $userManager->updateUser($user);
        $view->setData($user)->setStatusCode(200);

        return $view;
    }

    /**
     * Update a User to delete a friend data.<br/>
     *
     * @param ParamFetcher $paramFetcher Paramfetcher
     *
     * @RequestParam(name="user", nullable=false, strict=true, description="User id.")
     * @RequestParam(name="buddy", nullable=false, strict=true, description="User buddy id.")
     * @Put
     *
     * @return View
     */
    public function putDeleteBuddyAction(ParamFetcher $paramFetcher)
    {
        $id = $paramFetcher->get('user');
        $idBuddy = $paramFetcher->get('buddy');
        $userManager = $this->container->get('fos_user.user_manager');
        $user  =  $this->getDoctrine()->getEntityManager()->getRepository('SubwayBuddyUserBundle:User')->find($id);
        $buddy  =  $this->getDoctrine()->getEntityManager()->getRepository('SubwayBuddyUserBundle:User')->find($idBuddy);
        $user->removeBuddy($buddy);
        $view = Vieww::create();
        $userManager->updateUser($user);
        $view->setData($user)->setStatusCode(200);

        return $view;
    }

    /**
     * @param User $user
     * @return array
     * @View()
     * @ParamConverter("user", class="SubwayBuddyUserBundle:User")
     */
    public function getBuddyAction(User $user){
        $buddys = $user->getMyBuddys();
        if ($buddys->isEmpty()) {
            throw $this->createNotFoundException('Pas d\'amis, prend un curly!');
        }
        $view = Vieww::create();
        $view->setData($buddys)->setStatusCode(200);

        return $view;
    }
    //</editor-fold>

    //<editor-fold desc="Utile">
    /**
     * Ordre : latitude puis longitude, exemple : 40.714728 & -73.998672
     *
     * @return array
     * @View()
     */
    public function getMapAction(){
        // oui... c'est moche... mais c'est pour recup plusieurs GET (ya surement une méthode plus propre mais ça fonctionne :-))
        $latitude   = htmlspecialchars(addslashes($_GET['latitude']));
        $longitude  = htmlspecialchars(addslashes($_GET['longitude']));

        $screenWidth    = htmlspecialchars(addslashes($_GET['screenWidth']));
        $screenHeight   = htmlspecialchars(addslashes($_GET['screenHeight']));

        $zoom       = htmlspecialchars(addslashes($_GET['zoom']));

        // couleur du marqueur aléatoire
        $randomColors = array(
            "green", "blue", "purple", "black"
        );

        // api key : AIzaSyAl4z1V5vAzpFWTmBAby3cjhTy3ftsx2xk
        // 40.714728,-73.998672
        // exemple :  https://maps.googleapis.com/maps/api/staticmap?center=51.477222,0&size=300x400&zoom=14

        $imageGoogleMap = "https://maps.googleapis.com/maps/api/staticmap?center=".$latitude.",".$longitude."&size=".$screenWidth."x".$screenHeight."&zoom=" . $zoom ; 
        // on rajoute d'éventuelles personnes autour
        $users = $this->getDoctrine()->getEntityManager()->getRepository('SubwayBuddyUserBundle:User')->findAll() ;
        foreach( $users AS $user )
        {
            $user_latitude  = $user->getPos_latitude() ; 
            $user_longitude = $user->getPos_longitude() ;

            shuffle($randomColors);
            $imageGoogleMap .= "&markers=color:".$randomColors[0]."%7Clabel:".$user->getUsername()[0]."%7C".$user_latitude.",".$user_longitude ;
        }
        //put us in the center
        $imageGoogleMap .= "&markers=color:red%7Clabel:Me%7C".$latitude.",".$longitude ;

        // exemple : https://maps.googleapis.com/maps/api/staticmap?center=48.870781,2.207122&size=300x400&zoom=12&markers=color:3|label:G|0,0&markers=color:0|label:G|2.206961,47.871677&markers=color:4|label:G|2.206961,48.871677&markers=color:0|label:G|5,4&markers=color:4|label:G|48.871604,2.20424&markers=color:0|label:G|5,4
        $view = Vieww::create();
        $view->setData(
            array( 
                "image" => $imageGoogleMap 
            )
        )->setStatusCode(200);

        return $view;
    }

    /**
     * @return array
     * @View()
     */
    public function getProfileAction(User $user){
        $chatRooms  =  $user->getChatrooms();
        $travels = $user->getTravels();
        $subjects = $user->getSubjects();
        $friendsRequest = $user->getBuddysWithMe();
        $friends = $user->getMyBuddys();


        $view = Vieww::create();
        $view->setData(
            array(
                "user" => $user,
                "chatrooms" => $chatRooms,
                "travels" => $travels,
                "subjects" => $subjects,
                "friendsRequest" => $friendsRequest,
                "friends" => $friends
            )
        )->setStatusCode(200);
        return $view;
    }
    //</editor-fold>

    //<editor-fold desc="Sub subjects">
    /**
     *
     * @param ParamFetcher $paramFetcher Paramfetcher
     *
     * @RequestParam(name="subject", nullable=false, strict=true, description="Subject id.")
     * @RequestParam(name="child", nullable=false, strict=true, description="Child subject id.")
     * @Put
     *
     * @return View
     */
    public function putChildSubjectAction(ParamFetcher $paramFetcher)
    {
        $em = $this->getDoctrine()->getManager();

        $subjectId = $paramFetcher->get('subject');
        $childId = $paramFetcher->get('child');
        $subject = $em->getRepository('SubwayBuddyUserBundle:Subject')->find($subjectId);
        $child = $em->getRepository('SubwayBuddyUserBundle:Subject')->find($childId);

        $subject->addChildSubject($child);
        $em->persist($subject);
        $em->flush();

        $view = Vieww::create();
        $view->setData(
            array(
                "subject" => $subject
            )
        )->setStatusCode(200);

        return $view;
    }

    /**
     *
     * @param ParamFetcher $paramFetcher Paramfetcher
     *
     * @RequestParam(name="subject", nullable=false, strict=true, description="Subject id.")
     * @RequestParam(name="child", nullable=false, strict=true, description="Child subject id.")
     * @Delete()
     *
     * @return View
     */
    public function deleteChildSubjectAction(ParamFetcher $paramFetcher)
    {
        $em = $this->getDoctrine()->getManager();

        $subjectId = $paramFetcher->get('subject');
        $childId = $paramFetcher->get('child');
        $subject = $em->getRepository('SubwayBuddyUserBundle:Subject')->find($subjectId);
        $child = $em->getRepository('SubwayBuddyUserBundle:Subject')->find($childId);

        $subject->removeChildSubject($child);
        $em->persist($subject);
        $em->flush();

        $view = Vieww::create();
        $view->setData(
            array(
                "subject" => $subject
            )
        )->setStatusCode(200);

        return $view;
    }
    //</editor-fold>

    /**
    * @return array
    * @Get("/closeToMe/{user}")
    * @ParamConverter("user", class="SubwayBuddyUserBundle:User")
    */
    public function getClosestBuddyAction(User $user)
    {
        $em = $this->getDoctrine()->getManager();
        $entitys  =  $em->getRepository('SubwayBuddyUserBundle:User')->findAll();
        if (!$entitys) {
            throw $this->createNotFoundException('Data not found.');
        }
        $longitude = $user->getLongitude();
        $latitude = $user->getLatitude();
        $max_longitude = $longitude+0.5;
        $max_latitude = $latitude+0.5;
        $min_longitude = $longitude-0.5;
        $min_latitude = $latitude-0.5;
        $buddys = array();
        foreach($entitys as $buddy){
            if($buddy->getLongitude() && $buddy->getLatitude()){
                if($min_longitude < $buddy->getLongitude() && $buddy->getLongitude() < $max_longitude OR $min_longitude > $buddy->getLongitude() && $buddy->getLongitude() > $max_longitude){
                    if($min_latitude < $buddy->getLatitude() && $buddy->getLatitude() < $max_latitude OR $min_latitude > $buddy->getLatitude() && $buddy->getLatitude() > $max_latitude){
                        if($buddy != $user){

			    $fetchedTime 	= $buddy->getFetechedTime();
			    $fetchedTimeS 	= $fetchedTime->format('d') . "/" . $fetchedTime->format('m') . "/" . $fetchedTime->format('Y') . " " . $fetchedTime->format('H') . ":" . $fetchedTime->format('i') . ":" . $fetchedTime->format('s') ;  
                            $buddys[] = array(
                                "user" => $buddy->getUsername(),
                                "longitude" => $buddy->getLongitude(),
                                "latatitude" => $buddy->getLatitude(),
                                "subjects" => $buddy->getSubjects(),
                            	"fetchedTime"	=> $fetchedTimeS,
				"fetchedTimeTimestamp" => strtotime($fetchedTime)
				);
                        }
                    }
                }
            }
        }
        $view = Vieww::create();
        $view->setData($buddys)->setStatusCode(200);
        return $view;
    }


    /**
     *
     * @param ParamFetcher $paramFetcher Paramfetcher
     *
     * @RequestParam(name="latitude", nullable=false, strict=true, description="Latitude.")
     * @RequestParam(name="longitude", nullable=false, strict=true, description="Longitude.")
     * @RequestParam(name="user", nullable=false, strict=true, description="User id.")
     * @Put("/setPosition")
     *
     * @return View
     */
    public function putGpsPositionAction(ParamFetcher $paramFetcher){
        $em = $this->getDoctrine()->getManager();

        $userId = $paramFetcher->get('user');
        $latitude = $paramFetcher->get('latitude');
        $longitude = $paramFetcher->get('longitude');

        $user  =  $em->getRepository('SubwayBuddyUserBundle:User')->find($userId);

        if (!$user) {
            throw $this->createNotFoundException('User doesnt exist.');
        }

        $user->setPos_longitude($longitude);
        $user->setPos_latitude($latitude);

        $em->persist($user);
        $em->flush();

        $view = Vieww::create();
        $view->setData($user)->setStatusCode(200);
        return $view;
    }

    /**
     * @return array
     * @Get("/newMessageCount/{user}")
     * @ParamConverter("user", class="SubwayBuddyUserBundle:User")
     */
    public function getNewMessageCountAction(User $user){
        $chatsrooms = $user->getChatrooms();
        $count = 0;
        foreach($chatsrooms as $chatroom){
            if(!$chatroom->getMessages()->getLast()->isRead()){
                $count++;
            }
        }
        $view = Vieww::create();
        $view->setData($count)->setStatusCode(200);
        return $view;
    }

    /**
     * @return array
     * @Put("/messageRead/{chatroom}")
     * @ParamConverter("chatroom", class="SubwayBuddyUserBundle:Chatroom")
     */
    public function putMessageReadAction(Chatroom $chatroom){
        $em = $this->getDoctrine()->getManager();

        foreach($chatroom->getMessages() as $message){
            if(!$message->isRead()){
                $message->setRead(true);
                $em->persist($message);
            }
        }

        $em->flush();
        $view = Vieww::create();
        $view->setData("Ok")->setStatusCode(200);
        return $view;
    }


}
