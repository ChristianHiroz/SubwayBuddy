<?php

namespace SubwayBuddy\UserBundle\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;
use FOS\UserBundle\Model\User as BaseUser;
use Symfony\Component\Validator\Constraints\DateTime;

/**
 * User
 *
 * @ORM\Table()
 * @ORM\Entity(repositoryClass="SubwayBuddy\UserBundle\Entity\UserRepository")
 */
class User extends BaseUser
{
    /**
     * @var integer
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    protected $id;

    /**
     * @var ArrayCollection
     *
     * @ORM\OneToMany(targetEntity="SubwayBuddy\UserBundle\Entity\Travel", mappedBy="user")
     */
    public $travels;

    /**
     * @var ArrayCollection
     *
     *@ORM\ManyToMany(targetEntity="SubwayBuddy\UserBundle\Entity\Chatroom", inversedBy="users")
     */
    public $chatrooms;

    /**
     * @ORM\ManyToMany(targetEntity="User", mappedBy="myBuddys")
     **/
    private $buddysWithMe;


    /**
     * @ORM\OneToMany(targetEntity="SubwayBuddy\UserBundle\Entity\Subject", mappedBy="user", cascade={"remove"})
     */
    private $subjects;

    /**
     * @ORM\ManyToMany(targetEntity="User", inversedBy="buddysWithME")
     * @ORM\JoinTable(name="buddys",
     *      joinColumns={@ORM\JoinColumn(name="user_id", referencedColumnName="id")},
     *      inverseJoinColumns={@ORM\JoinColumn(name="buddy_user_id", referencedColumnName="id")}
     *      )
     **/
    private $myBuddys;

    /**
     * @var integer
     *
     * @ORM\Column(name="pos_latitude", type="float", nullable=true)
     */
    protected $pos_latitude;

    /**
     * @var integer
     *
     * @ORM\Column(name="pos_longitude", type="float", nullable=true)
     */
    protected $pos_longitude;

    /**
     * @var date
     *
     * @ORM\Column(name="texte", type="datetime", nullable=true)
     */
    private $fetechedTime;

    public function __construct() {
        parent::__construct();
        $this->travels = new ArrayCollection();
        $this->chatrooms = new ArrayCollection();
        $this->buddysWithMe = new \Doctrine\Common\Collections\ArrayCollection();
        $this->myBuddys = new \Doctrine\Common\Collections\ArrayCollection();
        $this->subjects = new ArrayCollection();
    }

    /**
     * Get id
     *
     * @return integer
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Get pos_latitude
     *
     * @return float
     */
    public function getPos_latitude()
    {
        return $this->pos_latitude;
    }

    /**
     * Get pos_longitude
     *
     * @return float
     */
    public function getPos_longitude()
    {
        return $this->pos_longitude;
    }

    /**
     * @return mixed
     */
    public function getTravels()
    {
        return $this->travels;
    }

    /**
     * @param mixed $travels
     */
    public function setTravels($travels)
    {
        $this->travels = $travels;
    }

    /**
     * @param Travel $travel
     */
    public function addTravel($travel)
    {
        $this->travels->add($travel);
    }

    /**
     * @return ArrayCollection
     */
    public function getChatrooms()
    {
        return $this->chatrooms;
    }

    /**
     * @param ArrayCollection $chatrooms
     */
    public function setChatrooms($chatrooms)
    {
        $this->chatrooms = $chatrooms;
    }

    /**
     * @param ChatRoom $chatroom
     */
    public function addChatroom($chatroom){
        $this->chatrooms[] = $chatroom;
    }

    /**
     * @return mixed
     */
    public function getMyBuddys()
    {
        return $this->myBuddys;
    }

    /**
     * @param mixed $myBuddys
     */
    public function setMyBuddys($myBuddys)
    {
        $this->myBuddys = $myBuddys;
    }

    public function addBuddy(User $buddy){
        $this->myBuddys[] = $buddy;
        if(!$buddy->myBuddys->contains($this)){
            $buddy->addBuddyWithMe($this);
        }
        if($this->buddysWithMe->contains($buddy)){
            $this->buddysWithMe->removeElement($buddy);
        }
    }

    public function addBuddyWithMe($buddy){
        $this->buddysWithMe[] = $buddy;
    }

    /**
     * @return mixed
     */
    public function getBuddysWithMe()
    {
        return $this->buddysWithMe;
    }

    /**
     * @param mixed $buddysWithMe
     */
    public function setBuddysWithMe($buddysWithMe)
    {
        $this->buddysWithMe = $buddysWithMe;
    }

    /**
     * @return mixed
     */
    public function getSubjects()
    {
        return $this->subjects;
    }

    /**
     * @param mixed $subjects
     */
    public function setSubjects($subjects)
    {
        $this->subjects = $subjects;
    }

    /**
     * @param mixed $subject
     */
    public function addSubject($subject)
    {
        $this->subjects->add($subject);
    }

    /**
     * Set pos_latitude
     *
     * @return float
     */
    public function setPos_latitude($pos_latitude)
    {
       $this->pos_latitude = $pos_latitude ;
        $this->fetechedTime = new \DateTime();
    }

    /**
     * Set pos_longitude
     *
     * @return float
     */
    public function setPos_longitude($pos_longitude)
    {
        $this->pos_longitude = $pos_longitude ;
    }

    public function getLatitude(){
        return $this->pos_latitude;
    }

    public function getLongitude(){
        return $this->pos_longitude;
    }

    /**
     * @return date
     */
    public function getFetechedTime()
    {
        return $this->fetechedTime;
    }

    /**
     * @param date $fetechedTime
     */
    public function setFetechedTime($fetechedTime)
    {
        $this->fetechedTime = $fetechedTime;
    }
}

