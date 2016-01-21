<?php

namespace SubwayBuddy\UserBundle\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;

/**
 * Subject
 *
 * @ORM\Table()
 * @ORM\Entity(repositoryClass="SubwayBuddy\UserBundle\Entity\SubjectRepository")
 */
class Subject
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
     * @ORM\Column(name="subject", type="string", length=255)
     */
    private $subject;

    /**
     * @var integer
     *
     * @ORM\Column(name="number", type="integer")
     */
    private $number;

    /**
     * @ORM\ManyToOne(targetEntity="SubwayBuddy\UserBundle\Entity\User", inversedBy="subjects")
     */
    private $user;

    /**
     * @ORM\ManyToMany(targetEntity="SubwayBuddy\UserBundle\Entity\Subject")
     */
    private $childsSubject;

    public function __construct(){
        $this->childsSubject = new ArrayCollection();
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
     * Set subject
     *
     * @param string $subject
     *
     * @return Subject
     */
    public function setSubject($subject)
    {
        $this->subject = $subject;

        return $this;
    }

    /**
     * Get subject
     *
     * @return string
     */
    public function getSubject()
    {
        return $this->subject;
    }

    /**
     * Set number
     *
     * @param integer $number
     *
     * @return Subject
     */
    public function setNumber($number)
    {
        $this->number = $number;

        return $this;
    }

    /**
     * Get number
     *
     * @return integer
     */
    public function getNumber()
    {
        return $this->number;
    }

    /**
     * @return User
     */
    public function getUser()
    {
        return $this->user;
    }

    /**
     * @param mixed $user
     */
    public function setUser($user)
    {
        $this->user = $user;
    }

    /**
     * @return mixed
     */
    public function getChildsSubject()
    {
        return $this->childsSubject;
    }

    /**
     * @param mixed $childsSubject
     */
    public function setChildsSubject($childsSubject)
    {
        $this->childsSubject = $childsSubject;
    }

    public function addChildSubject($childSubject){
        if(!$this->childsSubject->contains($childSubject)){
            $this->childsSubject->add($childSubject);
        }
    }

    public function removeChildSubject($childSubject){
        if($this->childsSubject->contains($childSubject)){
            $this->childsSubject->removeElement($childSubject);
        }
    }
}

