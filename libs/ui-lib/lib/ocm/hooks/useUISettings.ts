import React from 'react';
import { Cluster } from '@openshift-assisted/types/./assisted-installer-service';
import { UISettingService, UISettingsValues } from '../services';

const useUISettings = (clusterId?: Cluster['id']) => {
  const [uiSettings, setUISettings] = React.useState<UISettingsValues>();

  const updateUISettings = React.useCallback(
    async (newSettings: UISettingsValues) => {
      if (clusterId) {
        const updatedSettings = { ...uiSettings, ...newSettings };
        try {
          await UISettingService.update(clusterId, updatedSettings);
          setUISettings(updatedSettings);
        } catch (e) {
          // todo
        }
      }
    },
    [uiSettings],
  );

  const fetchUISettings = async () => {
    try {
      if (clusterId) {
        const settings = await UISettingService.fetch(clusterId);
        setUISettings(settings);
      }
    } catch (e) {
      // todo
    }
  };

  React.useEffect(() => {
    if (!uiSettings) {
      void fetchUISettings();
    }
  }, [uiSettings]);

  const returnValue = React.useMemo(
    () => ({ uiSettings, updateUISettings }),
    [uiSettings, updateUISettings],
  );

  return returnValue;
};

export default useUISettings;
