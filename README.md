# Hello Jenkins Retry Action! 👋
해당 액션은 Jenkins Job을 호출하며, 404 혹은 403 오류가 발생 시 일정 간격을 두고 재시도를 하기 위해 제작되었습니다.

## 사용법
```yaml
  - name: Call jenkins job
    uses: illuminarean-labs/jenkins-retry-action@main
    with:
      jenkins_url: 'http://jenkins_url:8080' # Jenkins URL
      jenkins_user: ${{ secrets.JENKINS_USER }} # Jenkins User ID
      jenkins_token: ${{ secrets.JENKINS_TOKEN }} # Jenkins User Token
      job_name: 'job_name' # Jenkins Job 이름
      max_retries: '5' # 최대 시도 횟수
      retry_interval_secs: '10' # 재시도 간격
      parameters: 'param1=value1,param2=value2' # Jenkins Job 파라미터
```

