/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from "react";
import { Page } from "../models/models";
import Button from "../components/Button";
import PageIndicator from "../components/onboarding/PageIndicator";
import { MdArrowBackIos, MdArrowForwardIos } from "react-icons/md";
import toast from "react-hot-toast";
import { Input } from "antd";
import { Select } from "antd";
import usersAPI from "../sdk/usersAPI";
import { UpdateProfileData } from "../models/models";

enum STEPS {
  INTRO1 = 0,
  INTRO2 = 1,
  INTRO3 = 2,
  PROFILEPUBLIC = 3,
}

interface OnboardProps {
  setCurrentPage: (page: Page) => void;
}

const Onboard: React.FC<OnboardProps> = ({ setCurrentPage }) => {
  const [step, setStep] = useState(STEPS.INTRO1);
  const [fullName, setFullName] = useState("");
  const [pronouns, setPronouns] = useState("");
  const [bio, setBio] = useState("");
  const [level, setLevel] = useState("");
  const [role1, setRole1] = useState("");
  const [role2, setRole2] = useState("");
  const [color1, setColor1] = useState("");
  const [color2, setColor2] = useState("");
  const [site, setSite] = useState("");
  const [discord, setDiscord] = useState("");
  const [notes, setNotes] = useState("");
  const [currentTeamId, setCurrentTeamId] = useState(0);
  const [currentTeamName, setCurrentTeamName] = useState("");
  const [queueColor, setQueueColor] = useState("");

  const [teams, setTeams] = useState<any[]>([]);
  const [profileData, setProfileData] = useState<UpdateProfileData>({});

  const onNext = () => {
    if (step === STEPS.PROFILEPUBLIC) {
      setProfileData({
        ...profileData,
        full_name: fullName,
        pronouns: pronouns,
        bio: bio,
        level: level,
        role1: role1,
        role2: role2,
        color1: color1,
        color2: color2,
        site: site,
        discord: discord,
        notes: notes,
        currentTeamId: currentTeamId,
        currentTeamName: currentTeamName,
        queueColor: queueColor,
      });
    } else {
      setStep((value) => value + 1);
    }
  };

  useEffect(() => {
    const getTeams = async () => {
      try {
        const res = await usersAPI.getTeams();
        setTeams(res.result);
      } catch (error) {
        console.error("Error fetching teams:", error);
      }
    };

    getTeams();
  }, [teams]);

  useEffect(() => {
    const team = teams.find((team) => team.teamName === currentTeamName);
    if (team) {
      setCurrentTeamId(team.teamNum);
    } else {
      setCurrentTeamId(0);
    }
  }, [currentTeamName, teams]);

  useEffect(() => {
    const updateProfile = async () => {
      try {
        const res = await usersAPI.updateProfile(profileData);

        if (res.ok) {
          toast.success("Refresh to see your saved profile");
          setCurrentPage(Page.Dashboard);
        } else {
          toast.error("Failed to create profile");
        }
      } catch (error) {
        console.error("Error updating profile:", error);
        toast.error("An error occurred while creating profile");
      }
    };

    // Trigger only when specified fields change
    if (
      profileData.full_name ||
      profileData.bio ||
      profileData.color1 ||
      profileData.color2 ||
      profileData.discord ||
      profileData.level ||
      profileData.notes ||
      profileData.site ||
      profileData.role1 ||
      profileData.role2 ||
      profileData.pronouns ||
      profileData.queueColor ||
      profileData.currentTeamId ||
      profileData.currentTeamName
    ) {
      updateProfile();
    }
  }, [
    profileData.full_name,
    profileData.bio,
    profileData.color1,
    profileData.color2,
    profileData.discord,
    profileData.level,
    profileData.notes,
    profileData.site,
    profileData.role1,
    profileData.role2,
    profileData.pronouns,
    profileData.queueColor,
    profileData.currentTeamId,
    profileData.currentTeamName,
    setCurrentPage,
    profileData,
  ]);

  const onBack = () => {
    setStep((value) => value - 1);
  };

  // INTRO1
  let bodyContent = (
    <div className="flex flex-row justify-between">
      {/* (Side Panel Container) */}
      <div className="p-12 sm:p-20 flex-1">
        {/* Side Section */}
        <div className="flex flex-col gap-4 m-16 max-w-[320px]">
          <PageIndicator
            currentStep={step}
            totalSteps={Object.keys(STEPS).length / 2}
          />
          <h1 className="my-3 text-headings font-bold text-2xl sm:text-3xl">
            Welcome to GameheadsLab!
          </h1>
          <p className="text-body text-xs sm:text-sm">
            GameheadsLabs is an official workspace to provide a space for a
            students and staff during the Summer Accelerator Program.
          </p>
          <Button
            label={`Next`}
            onClick={onNext}
            icon={MdArrowForwardIos}
            iconPos="right"
          />
        </div>
      </div>

      {/* Backdrop */}
      <div
        className="
                hidden
                lg:flex
                lg:flex-1
                lg:justify-center
                lg:items-center
                bg-gh_green-500
            "
      >
        <img
          src="/graphics/intro1.png"
          alt="Intro 1 Backdrop"
          style={{ maxWidth: "100%", height: "auto" }}
        />
      </div>
    </div>
  );

  if (step === STEPS.INTRO2) {
    bodyContent = (
      <div className="flex flex-row justify-between">
        {/* (Side Panel Container) */}
        <div className="p-12 sm:p-20 flex-1">
          {/* Side Section */}
          <div className="flex flex-col gap-4 m-16 max-w-[320px]">
            <PageIndicator
              currentStep={step}
              totalSteps={Object.keys(STEPS).length / 2}
            />
            <h1 className="my-3 text-headings font-bold text-2xl sm:text-3xl">
              GameheadsLabs Profiles & Identity Center
            </h1>
            <p className="text-body text-xs sm:text-sm">
              Users are verified Gameheads students because you were invited by
              someone on the platform!
            </p>
            <div className="flex flex-row gap-3">
              <Button
                label={`Back`}
                onClick={onBack}
                icon={MdArrowBackIos}
                outline
              />
              <Button
                label={`Next`}
                onClick={onNext}
                icon={MdArrowForwardIos}
                iconPos="right"
              />
            </div>
          </div>
        </div>

        {/* Backdrop */}
        <div
          className="
                    hidden
                    lg:flex
                    lg:flex-1
                    lg:justify-center
                    lg:items-center
                    bg-gh_green-500
                "
        >
          <img
            src="/graphics/intro2.png"
            alt="Intro 2 Backdrop"
            style={{ maxWidth: "100%", height: "auto" }}
          />
        </div>
      </div>
    );
  }

  if (step === STEPS.INTRO3) {
    bodyContent = (
      <div className="flex flex-row justify-between">
        {/* (Side Panel Container) */}
        <div className="p-12 sm:p-20 flex-1">
          {/* Side Section */}
          <div className="flex flex-col gap-4 m-16 max-w-[320px]">
            <PageIndicator
              currentStep={step}
              totalSteps={Object.keys(STEPS).length / 2}
            />
            <h1 className="my-3 text-headings font-bold text-2xl sm:text-3xl">
              Adding your Gamehead Projects
            </h1>
            <p className="text-body text-xs sm:text-sm">
              Adding your projects is as easy as 1-2-3 to showcase your projects
              and share with other Gameheads students across sites and the
              public as well!
            </p>
            <div className="flex flex-row gap-3">
              <Button
                label={`Back`}
                onClick={onBack}
                icon={MdArrowBackIos}
                outline
              />
              <Button
                label={`Next`}
                onClick={onNext}
                icon={MdArrowForwardIos}
                iconPos="right"
              />
            </div>
          </div>
        </div>

        {/* Backdrop */}
        <div
          className="
                    hidden
                    lg:flex
                    lg:flex-1
                    lg:justify-center
                    lg:items-center
                    bg-gh_green-500
                "
        >
          <img
            src="/graphics/intro2.png"
            alt="Intro 2 Backdrop"
            style={{ maxWidth: "100%", height: "auto" }}
          />
        </div>
      </div>
    );
  }

  if (step === STEPS.PROFILEPUBLIC) {
    bodyContent = (
      <div className="flex flex-row justify-between h-full">
        {/* (Form Panel Container) */}
        <div className="flex-1 p-6 sm:p-12 overflow-y-auto">
          {/* Form Section */}
          <div className="flex flex-col gap-7 max-w-[480px] mx-auto">
            <h1 className="my-2 text-headings font-bold text-2xl sm:text-3xl">
              Complete your profile
            </h1>
            <p className="text-body text-xs sm:text-sm">
              These will be visible to the public.
            </p>
            <div className="flex flex-col gap-4 my-2">
              <Input
                placeholder="First & Last Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                status={fullName.length == 0 ? "warning" : ""}
                className="max-w-[500px] !border-black p-2 pl-3 focus:placeholder-gray-300 !bg-cream"
              />
              <Input
                placeholder="Pronouns"
                value={pronouns}
                className="max-w-[500px] !border-black p-2 pl-3 focus:placeholder-gray-300 !bg-cream"
                onChange={(e) => setPronouns(e.target.value)}
              />
            </div>

            <Input.TextArea
              placeholder="Bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              status={bio.length == 0 ? "warning" : ""}
              showCount
              className="!border-black !bg-cream"
              style={{ padding: "4px 2px", resize: "none" }}
              rows={5}
              maxLength={300}
            />
            <Input.TextArea
              placeholder="Site Name (e.g., Oakland, Hawaii)"
              value={site}
              onChange={(e) => setSite(e.target.value)}
              status={site.length == 0 ? "warning" : ""}
              showCount
              className="!border-black !bg-cream"
              style={{ padding: "4px 2px", resize: "none" }}
              rows={2}
              maxLength={50}
            />

            <Input.TextArea
              placeholder="Gameheads Level (Newb or Vet)"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              status={level.length == 0 ? "warning" : ""}
              showCount
              className="!border-black !bg-cream"
              style={{ padding: "4px 2px", resize: "none" }}
              rows={2}
              maxLength={50}
            />

            <Input.TextArea
              placeholder="Personality 1 (red, green, orange, blue)"
              value={color1}
              onChange={(e) => setColor1(e.target.value)}
              status={color1.length == 0 ? "warning" : ""}
              showCount
              className="!border-black !bg-cream"
              style={{ padding: "4px 2px", resize: "none" }}
              rows={2}
              maxLength={50}
            />

            <Input.TextArea
              placeholder="Personality 2 (red, green, orange, blue)"
              value={color2}
              onChange={(e) => setColor2(e.target.value)}
              status={color2.length == 0 ? "warning" : ""}
              showCount
              className="!border-black !bg-cream"
              style={{ padding: "4px 2px", resize: "none" }}
              rows={2}
              maxLength={50}
            />

            <Input.TextArea
              placeholder="Discord username"
              value={discord}
              onChange={(e) => setDiscord(e.target.value)}
              status={discord.length == 0 ? "warning" : ""}
              showCount
              className="!border-black !bg-cream"
              style={{ padding: "4px 2px", resize: "none" }}
              rows={2}
              maxLength={50}
            />

            <Input.TextArea
              placeholder="Role 1"
              value={role1}
              onChange={(e) => setRole1(e.target.value)}
              status={role1.length == 0 ? "warning" : ""}
              showCount
              className="!border-black !bg-cream"
              style={{ padding: "4px 2px", resize: "none" }}
              rows={2}
              maxLength={50}
            />

            <Input.TextArea
              placeholder="Role 2"
              value={role2}
              onChange={(e) => setRole2(e.target.value)}
              status={role2.length == 0 ? "warning" : ""}
              showCount
              className="!border-black !bg-cream"
              style={{ padding: "4px 2px", resize: "none" }}
              rows={2}
              maxLength={50}
            />

            <Input.TextArea
              placeholder="Notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              status={notes.length == 0 ? "warning" : ""}
              showCount
              className="!border-black !bg-cream"
              style={{ padding: "4px 2px", resize: "none" }}
              rows={5}
              maxLength={300}
            />

            <label htmlFor="queueColor">Your Team Presentation Color</label>
            <Select
              id="queueColor"
              value={queueColor}
              onChange={(value) => {
                setQueueColor(value);
              }}
              status={queueColor.length === 0 ? "warning" : undefined}
              style={{ width: "100%" }}
              placeholder="Select your presentation color from Week 1"
            >
              <Select.Option value="blue">Blue</Select.Option>
              <Select.Option value="green">Green</Select.Option>
            </Select>

            <label htmlFor="currentTeamName">Your Team Name</label>
            <Select
              id="currentTeamName"
              value={currentTeamName}
              onChange={(value) => {
                setCurrentTeamName(value);
              }}
              status={currentTeamName.length === 0 ? "warning" : undefined}
              style={{ width: "100%" }}
              placeholder="Select your team name"
            >
              {teams.map((item: any) => {
                return (
                  <Select.Option key={item.teamNum} value={item.teamName}>
                    {item.teamName}
                  </Select.Option>
                );
              })}
            </Select>

            <label htmlFor="currentTeamId">Your Team Number</label>
            <Select
              disabled={true}
              id="currentTeamId"
              value={currentTeamId}
              onChange={(value) => {
                setCurrentTeamId(value);
              }}
              status={!currentTeamId ? "warning" : undefined}
              style={{ width: "100%" }}
              placeholder="Select your team number"
            >
              {teams.map((item: { teamNum: string; teamName: string }) => (
                <Select.Option key={item.teamNum} value={item.teamNum}>
                  {item.teamNum}
                </Select.Option>
              ))}
            </Select>

            <div className="flex flex-row gap-3 mt-10">
              <Button
                label={`Back`}
                onClick={onBack}
                icon={MdArrowBackIos}
                outline
              />
              <Button label={`Save`} onClick={onNext} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="my-4 sm:my-6 sm:mx-28 bg-cream sm:rounded-md shadow-md">
      {bodyContent}
    </div>
  );
};

export default Onboard;
