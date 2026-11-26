# Python 문법 정리

Python 문법을 주제별로 복습하는 노트북 모음입니다. 각 파일은 개념 설명(마크다운) + 실행 코드 + 실행 결과가 함께 저장된 Jupyter Notebook(`.ipynb`)입니다.

## 실행 방법

```bash
cd python-syntax
pip install jupyter
jupyter notebook
```

또는 VS Code에서 `.ipynb` 파일을 바로 열어도 됩니다. 노트북은 이미 실행 결과가 저장된 상태로 커밋되어 있어서, 실행하지 않고 GitHub에서 바로 읽기만 해도 결과를 볼 수 있습니다. 직접 셀을 실행해보고 싶다면 커널을 "Restart & Run All"로 돌리는 걸 추천합니다.

## 구성

| 노트북 | 개념 | 한 줄 요약 |
|---|---|---|
| [`01-variables-types`](./01-variables-types.ipynb) | 변수 / 타입 / 연산자 | 동적 타이핑, `//` `%` `**`, f-string, `is` vs `==`, 가변/불변 |
| [`02-control-flow`](./02-control-flow.ipynb) | 제어문 | `enumerate`/`zip`, `for...else`, Python 3.10+ `match-case` |
| [`03-data-structures`](./03-data-structures.ipynb) | 자료구조 | list/tuple/dict/set, 슬라이싱, list/dict/set comprehension |
| [`04-functions-advanced`](./04-functions-advanced.ipynb) | 함수 심화 | mutable default 함정, `*args`/`**kwargs`, 키워드 전용 인자, 클로저 |
| [`05-decorators`](./05-decorators.ipynb) | 데코레이터 | `functools.wraps`, 인자를 받는 데코레이터, `lru_cache` |
| [`06-oop-classes`](./06-oop-classes.ipynb) | 클래스 / OOP | 매직 메서드(`__repr__`/`__eq__`/`__getitem__` 등) ↔ 실제 호출 매핑, `@property`, 상속, `@dataclass` |
| [`07-iterators-generators`](./07-iterators-generators.ipynb) | 이터레이터 / 제너레이터 | 이터레이터 프로토콜, `yield`, 메모리 효율, `itertools` |
| [`08-exceptions-context-manager`](./08-exceptions-context-manager.ipynb) | 예외 처리 & with | 커스텀 예외 계층, `with`, `__enter__`/`__exit__`, `contextlib.contextmanager` |
| [`09-type-hints`](./09-type-hints.ipynb) | 타입 힌트 | `typing`, `Optional`/`Union`/`Callable`, `TypedDict`, mypy |
| [`10-modules-packages`](./10-modules-packages.ipynb) | 모듈 / 패키지 구조화 | `import` 형태, `__init__.py`, `if __name__ == "__main__"` |
| [`11-concurrency-async`](./11-concurrency-async.ipynb) | 동시성 / 비동기 | GIL, `threading` vs `multiprocessing`, `asyncio`/`await` |
| [`12-stdlib-tips`](./12-stdlib-tips.ipynb) | 표준 라이브러리 치트시트 | `pathlib`, `collections`, `itertools`, `functools`, `logging` |

## 다음에 더 해볼만한 것

- numpy / pandas 등 ML 전용 라이브러리 문법은 순수 Python 문법과 결이 달라서, 필요해지면 `numpy-practice`처럼 별도 폴더로 분리
- `Protocol` (구조적 타이핑), `__slots__` 등 더 심화된 주제는 필요할 때 노트북 추가
- mypy를 실제로 설치해서 09번 예제에 타입 에러를 일부러 넣어보고 어떻게 잡히는지 확인해보기
