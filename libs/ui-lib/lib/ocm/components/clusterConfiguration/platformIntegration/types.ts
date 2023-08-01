import {
  FeatureId,
  NUTANIX_CONFIG_LINK,
  PlatformType,
  VSPHERE_CONFIG_LINK,
} from '../../../../common';

export type FeatureIdPlatform = Extract<
  FeatureId,
  'NUTANIX_INTEGRATION' | 'VSPHERE_INTEGRATION' | 'EXTERNAL_PLATFORM_OCI'
>;

export type DisabledInfo = {
  isDisabled: boolean;
  disabledReason?: string;
};

export type ExternalPlatformType = Extract<PlatformType, 'none' | 'nutanix' | 'oci' | 'vsphere'>;

export const EXTERNAL_PLATFORM_NONE = 'none';
const EXTERNAL_PLATFORM_NUTANIX = 'nutanix';
export const EXTERNAL_PLATFORM_ORACLE = 'oci';
const EXTERNAL_PLATFORM_VSPHERE = 'vsphere';

export const ExternalPlatformOptions = [
  EXTERNAL_PLATFORM_NONE,
  EXTERNAL_PLATFORM_NUTANIX,
  EXTERNAL_PLATFORM_ORACLE,
  EXTERNAL_PLATFORM_VSPHERE,
] as ExternalPlatformType[];

export const externalPlatformLabels: { [K in ExternalPlatformType]: string } = {
  [EXTERNAL_PLATFORM_NONE]: 'No platform integration',
  [EXTERNAL_PLATFORM_NUTANIX]: 'Nutanix',
  [EXTERNAL_PLATFORM_ORACLE]: 'Oracle  (Requires a custom manifest)',
  [EXTERNAL_PLATFORM_VSPHERE]: 'vSphere',
};

export const externalPlatformFeatureIds: {
  [K in ExternalPlatformType]: FeatureId | undefined;
} = {
  [EXTERNAL_PLATFORM_NONE]: undefined,
  [EXTERNAL_PLATFORM_NUTANIX]: 'NUTANIX_INTEGRATION',
  [EXTERNAL_PLATFORM_ORACLE]: 'EXTERNAL_PLATFORM_OCI',
  [EXTERNAL_PLATFORM_VSPHERE]: 'VSPHERE_INTEGRATION',
};

export const externalPlatformTooltips: { [K in ExternalPlatformType]: string | undefined } = {
  [EXTERNAL_PLATFORM_NONE]: undefined,
  [EXTERNAL_PLATFORM_NUTANIX]: undefined,
  [EXTERNAL_PLATFORM_ORACLE]:
    "To integrate with an external partner (for example, Oracle Cloud), you'll need to provide a custom manifest.",
  [EXTERNAL_PLATFORM_VSPHERE]: undefined,
};

export const externalPlatformLinks: {
  [K in ExternalPlatformType]: string | undefined;
} = {
  [EXTERNAL_PLATFORM_NONE]: undefined,
  [EXTERNAL_PLATFORM_NUTANIX]: NUTANIX_CONFIG_LINK,
  [EXTERNAL_PLATFORM_ORACLE]: undefined,
  [EXTERNAL_PLATFORM_VSPHERE]: VSPHERE_CONFIG_LINK,
};
