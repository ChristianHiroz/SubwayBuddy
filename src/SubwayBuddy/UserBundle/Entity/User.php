<?php

namespace SubwayBuddy\UserBundle\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;
use FOS\UserBundle\Model\User as BaseUser;

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

    public function __construct()
    {
        parent::__construct();
        $this->travels = new ArrayCollection();
        $this->chatrooms = new ArrayCollection();
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
}

