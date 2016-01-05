<?php

namespace SubwayBuddy\UserBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

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
     * @var ChatRoom
     *
     *@ORM\ManyToOne(targetEntity="SubwayBuddy\UserBundle\Entity\Chatroom", inversedBy="messages")
     */
    private $chatroom;

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
}

