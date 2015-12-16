<?php

namespace SubwayBuddy\UserBundle\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;

/**
 * Chatroom
 *
 * @ORM\Table()
 * @ORM\Entity(repositoryClass="SubwayBuddy\UserBundle\Entity\ChatroomRepository")
 */
class Chatroom
{
    /**
     * @var integer
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @var string
     *
     * @ORM\Column(name="name", type="string", length=255)
     */
    private $name;

    /**
     * @var string
     *
     * @ORM\Column(name="description", type="string", length=255)
     */
    private $description;


    /**
     * @var arrayCollection
     *
     *@ORM\ManyToMany(targetEntity="SubwayBuddy\UserBundle\Entity\User", inversedBy="chatrooms")
     */
    private $users;

    /**
     * @var arrayCollection
     *
     *@ORM\OneToMany(targetEntity="SubwayBuddy\UserBundle\Entity\Message", mappedBy="chatroom" , cascade={"remove","persist"})
     */
    private $messages;


    public function __construct(){
        $this->users = new ArrayCollection();
        $this->messages = new ArrayCollection();
    }

    /**
     * @return ArrayCollection
     */
    public function getUsers()
    {
        return $this->users;
    }

    /**
     * @param ArrayCollection $users
     */
    public function setUsers($users)
    {
        $this->users = $users;
    }

    /**
     * @param User $user
     */
    public function addUser($user){
        $this->users[] = $user;
    }

    /**
     * @return ArrayCollection
     */
    public function getMessages()
    {
        return $this->messages;
    }

    /**
     * @param ArrayCollection $messages
     */
    public function setMessages($messages)
    {
        $this->messages = $messages;
    }

    /**
     * @param Message $message
     */
    public function addMessage($message){
        $this->messages[] = $message;
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
     * Set name
     *
     * @param string $name
     *
     * @return Chatroom
     */
    public function setName($name)
    {
        $this->name = $name;

        return $this;
    }

    /**
     * Get name
     *
     * @return string
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * Set description
     *
     * @param string $description
     *
     * @return Chatroom
     */
    public function setDescription($description)
    {
        $this->description = $description;

        return $this;
    }

    /**
     * Get description
     *
     * @return string
     */
    public function getDescription()
    {
        return $this->description;
    }

}

