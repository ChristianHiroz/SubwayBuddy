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
     * @ORM\OneToMany(targetEntity="SubwayBuddy\UserBundle\Entity\Travel", mappedBy="user")
     */
    public $travels;

    public function __construct()
    {
        parent::__construct();
        $this->travels = new ArrayCollection();
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
}

