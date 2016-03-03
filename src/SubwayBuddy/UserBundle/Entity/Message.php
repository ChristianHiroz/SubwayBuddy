<?php

namespace SubwayBuddy\UserBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints\DateTime;

/**
 * Message
 *
 * @ORM\Table()
 * @ORM\Entity(repositoryClass="SubwayBuddy\UserBundle\Entity\MessageRepository")
 */
class Message
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
     * @ORM\Column(name="texte", type="string", length=255)
     */
    private $texte;

    /**
     * @var User
     *
     * @ORM\ManyToOne(targetEntity="SubwayBuddy\UserBundle\Entity\User", inversedBy="messages")
     */
    private $user;

    /**
     * @var DateTime
     *
     * @ORM\Column(name="sendDate", type="datetime")
     */
    private $sendDate;

    /**
     * @var boolean
     *
     * @ORM\Column(name="read", type="boolean")
     */
    private $read;

    /**
     * @var ChatRoom
     *
     *@ORM\ManyToOne(targetEntity="SubwayBuddy\UserBundle\Entity\Chatroom", inversedBy="messages")
     */
    private $chatroom;

    public function __construct(){
        $this->sendDate = new DateTime();
        $this->read = false;
    }

    /**
     * @return ChatRoom
     */
    public function getChatroom()
    {
        return $this->chatroom;
    }

    /**
     * @param ChatRoom $chatroom
     */
    public function setChatroom($chatroom)
    {
        $this->chatroom = $chatroom;
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
     * Set texte
     *
     * @param string $texte
     *
     * @return Message
     */
    public function setTexte($texte)
    {
        $this->texte = $texte;

        return $this;
    }

    /**
     * Get texte
     *
     * @return string
     */
    public function getTexte()
    {
        return $this->texte;
    }

    /**
     * Set user
     *
     * @param User $user
     *
     * @return Message
     */
    public function setUser($user)
    {
        $this->user = $user;

        return $this;
    }

    /**
     * Get user
     *
     * @return User
     */
    public function getUser()
    {
        return $this->user;
    }

    /**
     * @return DateTime
     */
    public function getSendDate()
    {
        return $this->sendDate;
    }

    /**
     * @return boolean
     */
    public function isRead()
    {
        return $this->read;
    }

    /**
     * @param boolean $read
     */
    public function setRead($read)
    {
        $this->read = $read;
    }
}

