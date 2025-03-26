import { Notify } from 'vant';

export default function errorCode(jsoncode,$scope) {
     Notify({
       message: $scope.$t(jsoncode),
       color: '#ad0000',
       background: '#ffe1e1',
     });
}