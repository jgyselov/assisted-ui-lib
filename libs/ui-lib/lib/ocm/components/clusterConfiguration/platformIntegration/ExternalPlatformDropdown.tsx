import React, { MouseEvent } from 'react';
import {
  Button,
  ButtonVariant,
  Dropdown,
  DropdownItem,
  DropdownToggle,
  FormGroup,
  Split,
  SplitItem,
  Tooltip,
} from '@patternfly/react-core';
import { CaretDownIcon } from '@patternfly/react-icons';
import { useField } from 'formik';
import { FeatureId, PlatformType, getFieldId } from '../../../../common';
import {
  ExternalPlatformType,
  EXTERNAL_PLATFORM_NONE,
  EXTERNAL_PLATFORM_ORACLE,
  ExternalPlatformOptions,
  externalPlatformFeatureIds,
  externalPlatformLabels,
  externalPlatformLinks,
  externalPlatformTooltips,
} from './types';
import {
  NewFeatureSupportLevelMap,
  useNewFeatureSupportLevel,
} from '../../../../common/components/newFeatureSupportLevels';

const INPUT_NAME = 'platform';
const fieldId = getFieldId(INPUT_NAME, 'input');

type ExternalPlatformDropdownProps = {
  showOciOption: boolean;
  onChange: (selectedPlatform: ExternalPlatformType) => void;
  cpuArchitecture?: string;
  clusterExists?: boolean;
  clusterPlatform?: PlatformType;
  featureSupportLevelData: NewFeatureSupportLevelMap | null;
};

type ExternalPlatformIntegrationStateInfo = {
  value: ExternalPlatformType;
  label: string;
  isDisabled: boolean;
  disabledReason?: string;
  href?: string;
  tooltip?: string;
  featureId?: FeatureId;
};

export const ExternalPlatformDropdown = ({
  showOciOption,
  onChange,
  cpuArchitecture,
  clusterPlatform,
  featureSupportLevelData,
}: ExternalPlatformDropdownProps) => {
  const featureSupportLevelContext = useNewFeatureSupportLevel();
  const [field, , { setValue }] = useField<string>(INPUT_NAME);
  const [isOpen, setOpen] = React.useState(false);

  const defaultValue = React.useMemo(() => {
    if (clusterPlatform !== undefined) {
      return clusterPlatform === 'baremetal' ? 'none' : clusterPlatform;
    } else {
      return 'none';
    }
  }, [clusterPlatform]);

  const [current, setCurrent] = React.useState<string>(defaultValue);
  const tooltipDropdownDisabled = `Platform integration is not supported when ${
    cpuArchitecture || ''
  } is selected`;

  const handleClick = (event: MouseEvent<HTMLButtonElement>, href: string) => {
    event.stopPropagation(); // Stop event propagation here
    window.open(href, '_blank');
  };

  const optionsMap = ExternalPlatformOptions.map((option) => {
    const featureId = externalPlatformFeatureIds[option];
    const getDisabledState = !!featureId && !!featureSupportLevelData;
    return {
      value: option,
      featureId,
      label: externalPlatformLabels[option],
      href: externalPlatformLinks[option],
      tooltip: externalPlatformTooltips[option],
      isDisabled: getDisabledState
        ? featureSupportLevelContext.isFeatureDisabled(featureId, featureSupportLevelData)
        : false,
      disabledReason:
        getDisabledState &&
        featureSupportLevelContext.getFeatureDisabledReason(featureId, featureSupportLevelData),
    };
  }) as ExternalPlatformIntegrationStateInfo[];

  const isDropdownDisabled = React.useMemo(() => {
    return optionsMap
      .filter((option) => option.value !== EXTERNAL_PLATFORM_NONE)
      .every((option) => option.isDisabled);
  }, [optionsMap]);

  const onSelect = React.useCallback(
    (event?: React.SyntheticEvent<HTMLDivElement>) => {
      const selectedPlatform = event?.currentTarget.id as ExternalPlatformType;
      setValue(selectedPlatform);
      setCurrent(selectedPlatform);
      setOpen(false);
      onChange(selectedPlatform);
    },
    [setOpen, setValue, onChange],
  );

  React.useEffect(() => {
    const isCurrentValueDisabled = !!optionsMap.find(({ value }) => value === current)?.isDisabled;
    if (isDropdownDisabled || isCurrentValueDisabled) {
      setCurrent('none');
    }
  }, [isDropdownDisabled, current, optionsMap]);

  const toggle = React.useMemo(
    () => (
      <DropdownToggle
        onToggle={(val) => setOpen(val)}
        toggleIndicator={CaretDownIcon}
        isText
        className="pf-u-w-100"
        isDisabled={isDropdownDisabled}
      >
        {externalPlatformLabels[current as ExternalPlatformType]}
      </DropdownToggle>
    ),
    [current, isDropdownDisabled],
  );

  const dropdownItems = React.useMemo(
    () =>
      optionsMap
        .filter(({ value }) => value !== EXTERNAL_PLATFORM_ORACLE || showOciOption)
        .map(({ value, isDisabled, disabledReason, href, label }) => (
          <DropdownItem key={value} id={value} isAriaDisabled={isDisabled}>
            <Split>
              <SplitItem>
                <Tooltip hidden={!isDisabled} content={disabledReason} position="top">
                  <div>{label}</div>
                </Tooltip>
              </SplitItem>
              {href && (
                <>
                  <SplitItem isFilled />
                  <SplitItem>
                    <Button
                      variant={ButtonVariant.link}
                      isInline
                      style={{ float: 'right' }}
                      onClick={(event) => handleClick(event, href)}
                    >
                      Learn more <i className="fas fa-external-link-alt" />
                    </Button>
                  </SplitItem>
                </>
              )}
            </Split>
          </DropdownItem>
        )),
    [optionsMap, showOciOption],
  );

  return (
    <FormGroup
      id={`form-control__${fieldId}`}
      fieldId={fieldId}
      label={'Integrate with external partner platforms'}
    >
      <Tooltip
        content={tooltipDropdownDisabled}
        hidden={!isDropdownDisabled}
        position="top"
        distance={7}
      >
        <Dropdown
          {...field}
          id={fieldId}
          dropdownItems={dropdownItems}
          toggle={toggle}
          isOpen={isOpen}
          className="pf-u-w-100"
          onSelect={onSelect}
        />
      </Tooltip>
    </FormGroup>
  );
};
