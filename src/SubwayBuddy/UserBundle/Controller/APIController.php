<?php

namespace SubwayBuddy\UserBundle\Controller;

use Doctrine\Common\Collections\ArrayCollection;
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
            $view = $this->getErrorsView($errors);
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
            $view = $this->getErrorsView($errors);
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
        $matchedUsers = array();
        foreach($matchedUsersArray as $matchedUser){
            $user           = $em->getRepository('SubwayBuddyUserBundle:User')->find($matchedUser[1]); 
            $subjects       = $em->getRepository('SubwayBuddyUserBundle:Subject')->findBy(array('user' => $matchedUser[1]));
            // quickfix : on supprime les sujet des subjects
            foreach( $subjects AS &$subject )
            {
                $subject->setUser( new ArrayCollection() ) ; 
            }
            $matchedUsers[] = array(
                "id"    => $user->getId(),
                "name"  => $user->getUsername(),
                "subjects"  => $subjects
            ) ;
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






}
