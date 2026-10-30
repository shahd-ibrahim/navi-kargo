import React from 'react';
import { UserType } from '../../types/cargo';

interface UserTypeSelectorProps {
  userType: UserType;
  onSelectUserType: (type: UserType) => void;
}

export const UserTypeSelector: React.FC<UserTypeSelectorProps> = ({
  userType,
  onSelectUserType,
}) => {
  return (
    <div className="flex bg-slate-900/60 p-1 rounded-xl border border-indigo-500/30 max-w-md mt-6">
      <button
        type="button"
        onClick={() => onSelectUserType('bireysel')}
        className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
          userType === 'bireysel'
            ? 'bg-indigo-600 text-white shadow'
            : 'text-slate-400 hover:text-white'
        }`}
      >
        Bireysel Müşteri
      </button>
      <button
        type="button"
        onClick={() => onSelectUserType('kurumsal')}
        className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
          userType === 'kurumsal'
            ? 'bg-indigo-600 text-white shadow'
            : 'text-slate-400 hover:text-white'
        }`}
      >
        Sözleşmeli Kurumsal
      </button>
      <button
        type="button"
        onClick={() => onSelectUserType('misafir')}
        className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
          userType === 'misafir'
            ? 'bg-indigo-600 text-white shadow'
            : 'text-slate-400 hover:text-white'
        }`}
      >
        Hızlı Misafir
      </button>
    </div>
  );
};

export default UserTypeSelector;

