import * as React from "react";

import { Image } from "react-native";

//Asset Import
import IconPin from "./../image/icon_pin.svg";
import IconBack from "./../image/icon_back.svg";
import IllustrationBg from "./../image/img_bg.svg";
import ChevronRight from "./../image/chevron-right.svg";
import IconResolved from "./../image/icon_resolved.svg";
import IconAssignTo from "./../image/icon_assign_to.svg";
import IconBackBlack from "./../image/icon_back_black.svg";
import LogoLennaOmni from "./../image/logo_lenna_omni.svg";
import IconMicActive from "./../image/icon_mic_active.svg";
import IconAttachment from "./../image/icon_attachment.svg";
import LogoOmnimobile from "./../image/logo_omnimobile.svg";
import ImageCarousel1 from "./../image/image_carousel1.svg";
import ImageCarousel2 from "./..//image/image_carousel2.svg";
import IconBotDefault from "./../image/icon_bot_default.svg";
import IconPaperPlane from "./../image/icon_paper_plane.svg";
import IconLineActive from "./../image/icon_line_active.svg";
import IconHomeActive from "./../image/icon_home_active.svg";
import IconMicInactive from "./../image/icon_mic_inactive.svg";
import IconLineInActive from "./../image/icon_line_inactive.svg";
import IconMoreVertical from "./../image/icon_more_vertical.svg";
import IconAdminDefault from "./../image/icon_admin_default.svg";
import IconHomeInActive from "./../image/icon_home_inactive.svg";
import IconOverallUsers from "./../image/icon_overall_users.svg";
import ImgAssignFromAgent from "./../image/assign_from_agent.svg";
import IconHeroIlustrasi from "./../image/icon_hero_ilustrasi.svg";
import IllustrationSplash1 from "./../image/illustration_splash1.svg";
import IllustrationSplash2 from "./../image/illustration_splash2.svg";
import IllustrationSplash3 from "./../image/illustration_splash3.svg";
import IllustrationSplash4 from "./../image/illustration_splash4.svg";
import IconAttachmentWhite from "./../image/icon_attachment_white.svg";
import IconDashboardActive from "./../image/icon_dashboard_active.svg";
import ProfileImageDisplay from "./../image/profile_image_display.svg";
import IconOverallMessages from "./../image/icon_overall_messages.svg";
import IconPaperPlaneAttach from "./../image/icon_paper_plane_attach.svg";
import IconChatpanelInactive from "./../image/icon_chatpanel_inactive.svg";
import IconDashboardInActive from "./../image/icon_dashboard_inactive.svg";
import ProfileChangePassword from "./../image/profile_change_password.svg";
import IconLoginIllustration from "./../image/icon_login_illustration.svg";
import IconPluCirclInactive from "./../image/icon_plus_circle_inactive.svg";
import IconFemaleAgentDefault from "./../image/icon_female_agent_default.svg";
import IllustrationNoActiveChat from "./../image/illustration_no_active_chat.svg";

import IconAmount from "./../image/icon_amount.svg";
import IconTransaction from "./../image/icon_transaction.svg";

// New Add By Fachri
import IconChevronDown from "./chevrons-down.svg";
import IconEyeOff from "./eye-off.svg";
import IconEye from "./eye.svg";
import IconCheckCircle from "./check-circle.svg";
import IconXCircle from "./x-circle.svg";
import IconX from "./x.svg";
import IconUploadCLoud from "./upload-cloud.svg";
import IconTrash2 from "./trash-2.svg";
import IconCheck from "./check.svg";
import IconFile from "./file.svg";
import IconPlus from "./plus.svg";
import IconEdit2 from "./edit-2.svg";
import IconEyeWhite from "./eye-white.svg";
import IconXWhite from "./x-white.svg";
import IconLink from "./link.svg";
import IconImage from "./image.svg";
import IconPlusCircle from "./plus-circle.svg";
import IconTrash2Blue from "./trash-2-blue.svg";
import IconChevronLeft from "./chevron-left.svg";
import IconLayout from "./layout.svg";

export {
  IconChevronDown,
  IconEyeOff,
  IconEye,
  IconCheckCircle,
  IconXCircle,
  IconX,
  IconUploadCLoud,
  IconTrash2,
  IconCheck,
  IconFile,
  IconPlus,
  IconEdit2,
  IconEyeWhite,
  IconXWhite,
  IconLink,
  IconImage,
  IconPlusCircle,
  IconTrash2Blue,
  IconChevronLeft,
  IconLayout
};

export const imageIconTransaction = (paramsWidth, paramsHeight) => {
  return <IconTransaction width={paramsWidth} height={paramsHeight} />;
};

export const imageIconAmount = (paramsWidth, paramsHeight) => {
  return <IconAmount width={paramsWidth} height={paramsHeight} />;
};

export const imageIconOverallUsers = (paramsWidth, paramsHeight) => {
  return <IconOverallUsers width={paramsWidth} height={paramsHeight} />;
};

export const imageIconOverallMessages = (paramsWidth, paramsHeight) => {
  return <IconOverallMessages width={paramsWidth} height={paramsHeight} />;
};

export const imageProfileImageDisplay = (paramsWidth, paramsHeight) => {
  return <ProfileImageDisplay width={paramsWidth} height={paramsHeight} />;
};

export const imageIconHeroIlustrasi = (paramsWidth, paramsHeight) => {
  return <IconHeroIlustrasi width={paramsWidth} height={paramsHeight} />;
};

export const imageIconLoginIllustration = (paramsWidth, paramsHeight) => {
  return <IconLoginIllustration width={paramsWidth} height={paramsHeight} />;
};

export const imageProfileChangePassword = (paramsWidth, paramsHeight) => {
  return <ProfileChangePassword width={paramsWidth} height={paramsHeight} />;
};

export const imageImageCarousel1 = (paramsWidth, paramsHeight) => {
  return <ImageCarousel1 width={paramsWidth} height={paramsHeight} />;
};

export const imageImageCarousel2 = (paramsWidth, paramsHeight) => {
  return <ImageCarousel2 width={paramsWidth} height={paramsHeight} />;
};

export const imageIconPluCirclInactive = (paramsWidth, paramsHeight) => {
  return <IconPluCirclInactive width={paramsWidth} height={paramsHeight} />;
};

export const imageIconDashboardInActive = (paramsWidth, paramsHeight) => {
  return <IconDashboardInActive width={paramsWidth} height={paramsHeight} />;
};

export const imageIconChatpanelInactive = (paramsWidth, paramsHeight) => {
  return <IconChatpanelInactive width={paramsWidth} height={paramsHeight} />;
};

export const imageIconDashboardActive = (paramsWidth, paramsHeight) => {
  return <IconDashboardActive width={paramsWidth} height={paramsHeight} />;
};

export const imageIconHomeInActive = (paramsWidth, paramsHeight) => {
  return <IconHomeInActive width={paramsWidth} height={paramsHeight} />;
};

export const imageIconLineInActive = (paramsWidth, paramsHeight) => {
  return (
    <IconLineInActive
      width={paramsWidth}
      height={paramsHeight}
      style={{ marginTop: 4 }}
    />
  );
};

export const imageIconHomeActive = (paramsWidth, paramsHeight) => {
  return <IconHomeActive width={paramsWidth} height={paramsHeight} />;
};

export const imageIconLineActive = (paramsWidth, paramsHeight) => {
  return (
    <IconLineActive
      width={paramsWidth}
      height={paramsHeight}
      style={{ marginTop: 4 }}
    />
  );
};

export const imageIconAttachmentWhite = (paramsWidth, paramsHeight) => {
  return (
    <IconAttachmentWhite
      width={paramsWidth}
      height={paramsHeight}
      color={"#fff"}
    />
  );
};

export const imageIconPaperPlaneAttach = (paramsWidth, paramsHeight) => {
  return (
    <IconPaperPlaneAttach
      width={paramsWidth}
      height={paramsHeight}
      color={"#fff"}
    />
  );
};

export const imageIconFemaleAgentDefault = (
  paramsWidth,
  paramsHeight,
  value
) => {
  return (
    <IconFemaleAgentDefault
      style={{
        marginTop: 3,
        opacity: value,
        borderRadius: paramsWidth / 2
      }}
      width={paramsWidth}
      height={paramsHeight}
    />
  );
};

export const imageIconAdminDefault = (paramsWidth, paramsHeight, value) => {
  return (
    <IconAdminDefault
      style={{
        marginTop: 3,
        opacity: value,
        borderRadius: paramsWidth / 2
      }}
      width={paramsWidth}
      height={paramsHeight}
    />
  );
};

export const imageIconBotDefault = (paramsWidth, paramsHeight, value) => {
  return (
    <IconBotDefault
      style={{
        marginTop: 3,
        opacity: value,
        borderRadius: paramsWidth / 2
      }}
      width={paramsWidth}
      height={paramsHeight}
    />
  );
};

export const imageIllustrationNoActiveChat = (paramsWidth, paramsHeight) => {
  return <IllustrationNoActiveChat width={paramsWidth} height={paramsHeight} />;
};

export const imageIconMoreVertical = (paramsWidth, paramsHeight) => {
  return <IconMoreVertical width={paramsWidth} height={paramsHeight} />;
};

export const imageIconMicInactive = (paramsWidth, paramsHeight) => {
  return <IconMicInactive width={paramsWidth} height={paramsHeight} />;
};

export const imageIconPaperPlane = (paramsWidth, paramsHeight) => {
  return <IconPaperPlane width={paramsWidth} height={paramsHeight} />;
};

export const imageIconMicActive = (paramsWidth, paramsHeight) => {
  return <IconMicActive width={paramsWidth} height={paramsHeight} />;
};

export const imageIconAttachment = (paramsWidth, paramsHeight) => {
  return <IconAttachment width={paramsWidth} height={paramsHeight} />;
};

export const imageIconAssignTo = (paramsWidth, paramsHeight) => {
  return <IconAssignTo width={paramsWidth} height={paramsHeight} />;
};

export const imageIconResolved = (paramsWidth, paramsHeight) => {
  return <IconResolved width={paramsWidth} height={paramsHeight} />;
};

export const imageIconPin = (paramsWidth, paramsHeight) => {
  return <IconPin width={paramsWidth} height={paramsHeight} />;
};

export const imageIconBack = (paramsWidth, paramsHeight) => {
  return <IconBack width={paramsWidth} height={paramsHeight} />;
};

export const imageIconBackBlack = (paramsWidth, paramsHeight) => {
  return <IconBackBlack width={paramsWidth} height={paramsHeight} />;
};

export const imageAssignFromAgent = (paramsWidth, paramsHeight) => {
  return <ImgAssignFromAgent width={paramsWidth} height={paramsHeight} />;
};

export const imageLogoLennaOmni = (paramsWidth, paramsHeight) => {
  return <LogoLennaOmni width={paramsWidth} height={paramsHeight} />;
};

export const imageChevronRight = (paramsWidth, paramsHeight) => {
  return <ChevronRight width={paramsWidth} height={paramsHeight} />;
};

export const imageLogoOmnimobile = (paramsWidth, paramsHeight) => {
  return <LogoOmnimobile width={paramsWidth} height={paramsHeight} />;
};

export const imageIllustrationSplash1 = (paramsWidth, paramsHeight) => {
  return <IllustrationSplash1 width={paramsWidth} height={paramsHeight} />;
};

export const imageIllustrationSplash2 = (paramsWidth, paramsHeight) => {
  return <IllustrationSplash2 width={paramsWidth} height={paramsHeight} />;
};

export const imageIllustrationSplash3 = (paramsWidth, paramsHeight) => {
  return <IllustrationSplash3 width={paramsWidth} height={paramsHeight} />;
};

export const imageIllustrationSplash4 = (paramsWidth, paramsHeight) => {
  return <IllustrationSplash4 width={paramsWidth} height={paramsHeight} />;
};

export const imageIllustrationBg = (paramsWidth, paramsHeight) => {
  return <IllustrationBg width={paramsWidth} height={paramsHeight} />;
};
