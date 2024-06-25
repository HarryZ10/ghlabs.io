import { useState, useEffect } from "react";
import { MdOutlineInsertLink } from "react-icons/md";
import { EyeOutlined } from "@ant-design/icons";
import Paragraph from "antd/lib/typography/Paragraph";
import Title from "antd/lib/typography/Title";
import CustomIcon from "./CustomIcon";
import Avatar from "../../Avatar";
import usersSDK from "../../../sdk/usersAPI";

export const nameToIcon = {
  twitter: "/logos_external/twitter.png",
  instagram: "/logos_external/instagram.png",
  tiktok: "/logos_external/tiktok.png",
  threads: "/logos_external/threads.png",
  linkedin: "/logos_external/square_linkedin.png",
  youtube: "/logos_external/youtube.png",
  medium: "/logos_external/medium.png",
};

interface UserProfileProps {
  profile: any;
  setProfile: any;
  editable: boolean;
}

export const UserProfile: React.FC<UserProfileProps> = ({
  profile,
  setProfile,
  editable,
}) => {
  // const linkAccountsModal = useLinkAccountsModal();
  // const otherSitesModal = useOtherSitesModal();
  const [primaryEndorser, setPrimaryEndorser] = useState<any>({});

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await usersSDK.getUserByGameheadsId(
          profile.users_endorsed_by[0]
        );
        setPrimaryEndorser(data);
      } catch (error) {
        setPrimaryEndorser({ gameheadsID: "000000", full_name: "Unknown" });
      }
    };

    fetchUserData();
  }, [profile.gameheadsID, profile.users_endorsed_by]);

  // const { startUpload } = useUploadThing("imageUploader", {
  //     onUploadError: (error) => {
  //         throw (error);
  //     }
  // });

  return (
    <div className="rounded-md shadow-md overflow-hidden">
      <div className="w-full h-36 lg:bg-cover bg-center bg-[url('/graphics/default-header.png')] p-8" />
      <div className="bg-cream p-8">
        <div className="flex items-center w-full sm:justify-between space-x-4">
          <div className="flex flex-col w-full sm:justify-between gap-2">
            <div className="flex-shrink-0 flex-col items-center sm:items-start">

              {/* Profile Image, with y offset transform */}
              <div className="relative w-full sm:w-auto">
                <div className="absolute bottom-0 mx-auto sm:mx-0 translate-y-16 w-max left-0 right-0 sm:translate-x-0 sm:left-0">
                  <Avatar size={140} src={profile.profile_picture} />
                  {/* {editable ? (
                        <Upload
                        name="avatar"
                        showUploadList={false}
                        customRequest={async (e: any) => {
                            try {
                                toast.loading("Uploading profile picture");
                                const file = e.file;

                                if (!file) return;
                                const res = await startUpload([file]);
                                e.fileList = [];

                                if (!res || !res[0]) {
                                    throw new Error("Upload failed");
                                }

                                setProfile({ ...profile, profilePicture: res[0].url });
                                await usersAPI.updateProfile({ profilePicture: res[0].url });

                            } catch (error: any) {
                                if (error.message.includes("Unable to get presigned urls")) {
                                    toast.dismiss();
                                    toast.error("File is too large. Please try a smaller file.");
                                } else if (error.message.includes("Invalid config")) {
                                    toast.dismiss();
                                    toast.error("Invalid file type. Please try a different file.");
                                } else {
                                    toast.dismiss();
                                    toast.error("Failed to update profile picture. Please try again.");
                                }
                                return;
                            }

                            toast.dismiss();
                            toast.success("Profile picture updated");
                        }}
                    >
                        <button
                            className="
                                absolute
                                bottom-10
                                right-2
                                bg-gh_green-500
                                hover:bg-gh_green-400
                                hover:bg-opacity-90
                                hover:shadow-sm
                                text-white
                                p-2
                                border-0
                                rounded-full
                                cursor-pointer
                            "
                        >
                            <div className="text-base">
                                <MdOutlinePhotoCamera />
                            </div>
                        </button>
                    </Upload>
                    <></>
                  ) : (
                    <div className="mt-5"></div>
                  )} */}
                </div>
              </div>
              {/* Name */}
              <Title
                className="profile-name text-2xl sm:text-3xl font-bold mt-14 mb-0 text-center sm:text-left"
                editable={
                  !editable
                    ? false
                    : {
                        onChange: async (updatedName: string) => {
                          usersSDK.updateProfile({ full_name: updatedName });
                          setProfile({ ...profile, full_name: updatedName });
                        },
                      }
                }
              >
                {profile.full_name}
              </Title>
            </div>
            <div className="flex flex-col sm:grid sm:grid-cols-12 sm:gap-10">
              <div className="col-span-7 sm:col-span-8 sm:mr-8">

                {/* Pronouns */}
                <div
                  className="
                    flex flex-col 
                    sm:flex-row 
                    items-center 
                    gap-3 
                    mt-4
                    text-sm sm:text-base"
                >
                  {profile.pronouns && (
                    <>
                      <p className="text-caption">
                        Pronouns: {profile.pronouns}
                      </p>
                    </>
                  )}

                  {/* Metadata */}
                  <div className="flex flex-row items-center gap-2">
                    <p className="text-xs sm:text-sm text-links">
                      GH ID - #{profile.gameheadsID}
                    </p>
                    {editable && (
                      <div className="cursor-pointer mx-1">
                        <a
                          href={`profiles/0x${profile.gameheadsID}`}
                          target="_blank"
                        >
                          <EyeOutlined />
                        </a>
                      </div>
                    )}
                    <div
                      className="cursor-pointer mx-1"
                      onClick={(e) => {
                        navigator.clipboard.writeText(
                          `https://ghlabs-io.vercel.app/profiles/0x${profile.gameheadsID}`
                        );
                      }}
                    >
                      <MdOutlineInsertLink />
                    </div>
                  </div>
                </div>
                <div className="my-5">
                  <Paragraph
                    className="profile-bio"
                    editable={
                      !editable
                        ? false
                        : {
                            onChange: async (updatedBio) => {
                              usersSDK.updateProfile({ bio: updatedBio });
                              setProfile({ ...profile, bio: updatedBio });
                            },
                          }
                    }
                  >
                    {editable
                      ? profile.bio !== ""
                        ? profile.bio
                        : "Add a bio"
                      : profile.bio && profile.bio !== "Add a bio"
                      ? profile.bio
                      : ""}
                  </Paragraph>

                  <div className="hidden sm:block">
                    <div className="flex flex-col sm:flex-row gap-2 mt-4">
                      {profile?.other_links.map((item: any) => (
                        <a
                          key={item.url}
                          target="_blank"
                          href={item.url}
                          style={{
                            textDecoration: "none",
                            color: "inherit",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "15px",
                              padding: "10px",
                              borderRadius: "8px",
                            }}
                          >
                            <p
                              className="hover:underline"
                              style={{
                                fontSize: "18px",
                                margin: 0,
                              }}
                            >
                              {item.name}
                            </p>
                          </div>
                        </a>
                      ))}
                    </div>

                    {/* {editable &&
                        <Button
                            label="Add other sites"
                            icon={MdOutlineAddLink}
                            onClick={otherSitesModal.onOpen}
                            outline
                            className="mt-4"
                        />
                    } */}
                  </div>
                </div>
              </div>
              <div className="col-span-5 sm:col-span-4">
                <div className="bg-gh_green-50 rounded-md px-4 py-3.5 text-center sm:text-left">
                  <p className="text-xs sm:text-sm text-caption">Invited by</p>
                  <div className="lex flex-row justify-center sm:justify-start items-center space-x-2 text-sm sm:text-base text-center sm:text-left">
                    <span className="text-headings">
                      <strong>
                        {primaryEndorser.profile &&
                          primaryEndorser.profile.full_name}
                      </strong>
                    </span>
                    <a
                      href={`https://ghlabs.io/profiles/0x${
                        primaryEndorser.profile &&
                        primaryEndorser.profile.gameheadsID
                      }`}
                    >
                      <span className="text-links">
                        GH ID: #
                        {primaryEndorser.profile &&
                          primaryEndorser.profile.gameheadsID}
                      </span>
                    </a>
                  </div>
                </div>

                <div className="mt-2 text-sm rounded-md py-0 sm:py-3 sm:text-left text-center flex flex-col">
                  <p className="font-semibold mb-2 mt-2 sm:mt-0">Profiles</p>
                  <div className="flex flex-row gap-2 justify-center sm:justify-start">
                    {
                      /* Social Media Links */
                      profile.social_links.length > 0 ? (
                        profile.social_links.map((item: any, index: any) => {
                          const icon =
                            nameToIcon[
                              item?.name?.toLocaleLowerCase() as keyof typeof nameToIcon
                            ];
                          if (!icon) return null;
                          return (
                            <CustomIcon
                              key={index}
                              link={item.url}
                              shape="square"
                              size={35}
                              imagePath={icon}
                            />
                          );
                        })
                      ) : (
                        <p className="text-caption mb-3 sm:mb-0">
                          No Accounts Linked
                        </p>
                      )
                    }
                  </div>

                  {/* {editable &&
                        <>
                            <Button
                                label="Link Accounts"
                                icon={MdAdd}
                                className="w-full sm:max-w-max mt-4"
                                onClick={linkAccountsModal.onOpen}
                            />
                        </>
                    } */}

                  {/* <ContactButton profile={profile} editable={editable} /> */}
                </div>
              </div>
            </div>
            <div className="sm:hidden">
              <div className="flex flex-col sm:flex-row gap-2 mt-4">
                {profile.other_links.map((item: any) => (
                  <a
                    key={item.url}
                    target="_blank"
                    href={item.url}
                    style={{
                      textDecoration: "none",
                      color: "inherit",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "15px",
                        padding: "10px",
                        borderRadius: "8px",
                      }}
                    >
                      <p
                        style={{
                          fontSize: "18px",
                          margin: 0,
                        }}
                      >
                        {item.name}
                      </p>
                    </div>
                  </a>
                ))}
              </div>

              {/* <Button
                label="Add other sites"
                icon={MdOutlineAddLink}
                // onClick={otherSitesModal.onOpen}
                outline
                className="w-full sm:max-w-max"
          /> */}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
